import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
    try {
        const { network = "localhost", privateKey } = await request.json();

        // Validate network
        const validNetworks = ["localhost", "sepolia", "hardhat"];
        if (!validNetworks.includes(network)) {
            return NextResponse.json(
                { success: false, error: "Invalid network specified" },
                { status: 400 }
            );
        }

        // Validate private key for Sepolia
        if (network === "sepolia" && !privateKey) {
            return NextResponse.json(
                { success: false, error: "Private key required for Sepolia deployment" },
                { status: 400 }
            );
        }

        // Path to contracts directory
        const contractsDir = path.join(process.cwd(), "..", "contracts");
        const deployScript = path.join(contractsDir, "scripts", "deploy.cjs");

        // Check if deploy script exists
        if (!fs.existsSync(deployScript)) {
            return NextResponse.json(
                { success: false, error: "Deployment script not found" },
                { status: 404 }
            );
        }

        // Execute deployment
        const result = await executeDeployment(contractsDir, network, privateKey);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        // Read deployment info
        const deploymentPath = path.join(
            process.cwd(),
            "public",
            "deployment.json"
        );

        let deploymentData = null;
        if (fs.existsSync(deploymentPath)) {
            const fileContent = fs.readFileSync(deploymentPath, "utf-8");
            deploymentData = JSON.parse(fileContent);
        }

        return NextResponse.json({
            success: true,
            ...deploymentData,
            logs: result.logs,
        });
    } catch (error: any) {
        console.error("Deployment error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Deployment failed",
            },
            { status: 500 }
        );
    }
}

function executeDeployment(
    contractsDir: string,
    network: string,
    privateKey?: string
): Promise<{ success: boolean; error?: string; logs?: string[] }> {
    return new Promise((resolve) => {
        const logs: string[] = [];
        const args = ["hardhat", "run", "scripts/deploy.cjs"];

        if (network !== "localhost" && network !== "hardhat") {
            args.push("--network", network);
        }

        // Set up environment variables
        const envVars: NodeJS.ProcessEnv = { ...process.env };
        if (privateKey) {
            envVars.PRIVATE_KEY = privateKey;
        }

        const childProcess = spawn("npx", args, {
            cwd: contractsDir,
            shell: true,
            env: envVars,
        });

        childProcess.stdout.on("data", (data) => {
            const output = data.toString();
            console.log(output);
            logs.push(output);
        });

        childProcess.stderr.on("data", (data) => {
            const output = data.toString();
            console.error(output);
            logs.push(`ERROR: ${output}`);
        });

        childProcess.on("close", (code) => {
            if (code === 0) {
                resolve({ success: true, logs });
            } else {
                resolve({
                    success: false,
                    error: `Deployment process exited with code ${code}`,
                    logs,
                });
            }
        });

        childProcess.on("error", (error) => {
            resolve({
                success: false,
                error: error.message,
                logs,
            });
        });

        // Timeout after 5 minutes
        setTimeout(() => {
            childProcess.kill();
            resolve({
                success: false,
                error: "Deployment timeout (5 minutes)",
                logs,
            });
        }, 300000);
    });
}
