import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("🔍 Validating Templates...");

    const templatePath = path.join(__dirname, '../templates/ERC20_Template.sol');
    const outputPath = path.join(__dirname, '../generated/TestToken.sol');

    // 1. Read Template
    console.log(`reading ${templatePath}...`);
    let content = fs.readFileSync(templatePath, 'utf8');

    // 2. Mock Replacement (Simulate the Engine)
    content = content.replace(/{{CONTRACT_NAME}}/g, "TestToken");
    content = content.replace(/{{IMPORTS}}/g, 'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";');
    content = content.replace(/{{INHERITANCE}}/g, "ERC20");

    // Replace other placeholders with empty strings or safe defaults
    content = content.replace(/\/\/ {{STATE_VARIABLES}}/g, "");
    content = content.replace(/\/\/ {{EVENTS}}/g, "");
    content = content.replace(/{{CONSTRUCTOR_ARGS}}/g, "");
    content = content.replace(/{{CONSTRUCTOR_InHERITANCE}}/g, 'ERC20("TestToken", "TEST")');
    content = content.replace(/\/\/ {{CONSTRUCTOR_LOGIC}}/g, "_mint(msg.sender, 1000 * 10**18);");
    content = content.replace(/\/\/ {{FUNCTIONS}}/g, "");
    content = content.replace(/\/\/ {{OVERRIDES}}/g, "");

    // 3. Write Output
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated Mock Contract: ${outputPath}`);

    // 4. Compile
    try {
        console.log("🔨 Compiling with Hardhat...");
        execSync('npx hardhat compile', { stdio: 'inherit', cwd: path.join(__dirname, '../') });
        console.log("🎉 Template Validation Successful!");
    } catch (err) {
        console.error("❌ Validation Failed: Template Logic is broken.");
        if (err.stdout) console.log(err.stdout.toString());
        if (err.stderr) console.error(err.stderr.toString());
        process.exit(1);
    }
}

main();

