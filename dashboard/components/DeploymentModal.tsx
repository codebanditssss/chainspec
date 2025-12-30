"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Copy,
    Rocket,
    Network,
    FileCode,
    Eye,
    EyeOff,
    Wallet,
} from "lucide-react";

interface DeploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    contractName?: string;
    network: string;
    onDeploy: (network: string) => Promise<void>;
}

interface DeploymentResult {
    success: boolean;
    contractName?: string;
    address?: string;
    network?: string;
    verifiedUrl?: string;
    error?: string;
}

export function DeploymentModal({
    isOpen,
    onClose,
    contractName,
    network,
    onDeploy,
}: DeploymentModalProps) {
    const [deploying, setDeploying] = useState(false);
    const [result, setResult] = useState<DeploymentResult | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState(network);
    const [copied, setCopied] = useState(false);
    const [privateKey, setPrivateKey] = useState("");
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    const handleDeploy = async () => {
        setDeploying(true);
        setResult(null);

        try {
            // Call API with private key for Sepolia
            const res = await fetch('/api/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    network: selectedNetwork,
                    privateKey: selectedNetwork === 'sepolia' ? privateKey : undefined
                })
            });
            const data = await res.json();

            if (data.success) {
                setResult({
                    success: true,
                    ...data
                });
            } else {
                throw new Error(data.error || "Deployment failed");
            }
        } catch (error: any) {
            setResult({
                success: false,
                error: error.message || "Deployment failed",
            });
        } finally {
            setDeploying(false);
        }
    };

    const handleCopyAddress = () => {
        if (result?.address) {
            navigator.clipboard.writeText(result.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setResult(null);
        setDeploying(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Rocket className="h-5 w-5 text-primary" />
                        Deploy Contract
                    </DialogTitle>
                    <DialogDescription>
                        Deploy your smart contract to the blockchain
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Contract Info */}
                    {contractName && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-mono">{contractName}</span>
                        </div>
                    )}

                    {/* Network Selection */}
                    {!deploying && !result && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Network className="h-4 w-4" />
                                Select Network
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedNetwork === "localhost" ? "default" : "outline"}
                                    onClick={() => setSelectedNetwork("localhost")}
                                    className="flex-1"
                                >
                                    Localhost
                                </Button>
                                <Button
                                    variant={selectedNetwork === "sepolia" ? "default" : "outline"}
                                    onClick={() => setSelectedNetwork("sepolia")}
                                    className="flex-1"
                                >
                                    Sepolia Testnet
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {selectedNetwork === "localhost"
                                    ? "Deploy to your local Hardhat network for testing"
                                    : "Deploy to Sepolia testnet (requires ETH in your wallet)"}
                            </p>

                            {/* Private Key Input for Sepolia */}
                            {selectedNetwork === "sepolia" && (
                                <div className="space-y-3 mt-4">
                                    <Alert className="bg-yellow-500/10 border-yellow-500/20">
                                        <Wallet className="h-4 w-4 text-yellow-500" />
                                        <AlertTitle className="text-yellow-500 text-sm">Wallet Private Key Required</AlertTitle>
                                        <AlertDescription className="text-yellow-500/80 text-xs">
                                            ⚠️ Your private key is only used for this deployment and is NOT stored anywhere.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Private Key</label>
                                        <div className="relative">
                                            <Input
                                                type={showPrivateKey ? "text" : "password"}
                                                placeholder="0x..."
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                className="pr-10 font-mono text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPrivateKey ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Get from MetaMask: Account Details → Export Private Key
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Deployment Progress */}
                    {deploying && (
                        <Alert className="bg-blue-500/10 border-blue-500/20">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <AlertTitle className="text-blue-500">Deploying...</AlertTitle>
                            <AlertDescription className="text-blue-500/80">
                                <div className="space-y-1 mt-2">
                                    <p>• Compiling contract</p>
                                    <p>• Deploying to {selectedNetwork}</p>
                                    <p>• Waiting for confirmation</p>
                                    {selectedNetwork !== "localhost" && (
                                        <p>• Verifying on Etherscan</p>
                                    )}
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Result */}
                    {result?.success && (
                        <div className="space-y-3">
                            <Alert className="bg-green-500/10 border-green-500/20">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertTitle className="text-green-500">
                                    Deployment Successful!
                                </AlertTitle>
                                <AlertDescription className="text-green-500/80">
                                    Your contract has been deployed successfully
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2 p-4 bg-muted/30 rounded-md">
                                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                    <span className="text-muted-foreground">Contract:</span>
                                    <span className="font-mono font-semibold">
                                        {result.contractName}
                                    </span>

                                    <span className="text-muted-foreground">Network:</span>
                                    <Badge variant="secondary" className="w-fit">
                                        {result.network === "sepolia"
                                            ? "Sepolia Testnet"
                                            : result.network}
                                    </Badge>

                                    <span className="text-muted-foreground">Address:</span>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-background p-1.5 rounded font-mono">
                                            {result.address}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopyAddress}
                                            className="h-7 w-7 p-0"
                                        >
                                            {copied ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {result.verifiedUrl && (
                                    <div className="pt-3 border-t">
                                        <Button
                                            asChild
                                            className="w-full"
                                            variant="default"
                                        >
                                            <a
                                                href={result.verifiedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                View on Etherscan
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Result */}
                    {result?.success === false && (
                        <Alert className="bg-red-500/10 border-red-500/20">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <AlertTitle className="text-red-500">Deployment Failed</AlertTitle>
                            <AlertDescription className="text-red-500/80">
                                <p className="mt-2">{result.error}</p>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2">
                    {!deploying && !result && (
                        <>
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeploy}
                                disabled={!contractName || (selectedNetwork === 'sepolia' && !privateKey)}
                            >
                                <Rocket className="mr-2 h-4 w-4" />
                                Deploy Now
                            </Button>
                        </>
                    )}
                    {result && (
                        <Button onClick={handleClose}>
                            {result.success ? "Done" : "Close"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
