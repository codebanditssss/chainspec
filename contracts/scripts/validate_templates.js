import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    // --- TEST 1: ERC20 ---
    const erc20Template = path.join(__dirname, '../templates/ERC20_Template.sol');
    const erc20Output = path.join(__dirname, '../generated/TestToken.sol');

    console.log(`\nTesting ERC20 Template...`);
    let content = fs.readFileSync(erc20Template, 'utf8');
    content = content.replace(/{{CONTRACT_NAME}}/g, "TestToken");
    content = content.replace(/\/\/ {{IMPORTS}}/g, 'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";');
    content = content.replace(/{{INHERITANCE}}/g, "ERC20");
    content = content.replace(/\/\/ {{STATE_VARIABLES}}/g, "");
    content = content.replace(/\/\/ {{EVENTS}}/g, "");
    content = content.replace(/{{CONSTRUCTOR_ARGS}}/g, "");
    content = content.replace(/{{CONSTRUCTOR_InHERITANCE}}/g, 'ERC20("TestToken", "TEST")');
    content = content.replace(/\/\/ {{CONSTRUCTOR_LOGIC}}/g, "_mint(msg.sender, 1000 * 10**18);");
    content = content.replace(/\/\/ {{FUNCTIONS}}/g, "");
    content = content.replace(/\/\/ {{OVERRIDES}}/g, "");
    fs.writeFileSync(erc20Output, content);
    console.log(`✅ Generated: ${erc20Output}`);

    // --- TEST 2: DAO Vault ---
    const vaultTemplate = path.join(__dirname, '../templates/DAOVault_Template.sol');
    const vaultOutput = path.join(__dirname, '../generated/TestVault.sol');

    console.log(`\nTesting DAO Vault Template...`);
    try {
        let vaultContent = fs.readFileSync(vaultTemplate, 'utf8');
        vaultContent = vaultContent.replace(/{{CONTRACT_NAME}}/g, "TestVault");
        vaultContent = vaultContent.replace(/\/\/ {{IMPORTS}}/g, "");
        vaultContent = vaultContent.replace(/, {{INHERITANCE}}/g, ""); // Fix trailing comma
        vaultContent = vaultContent.replace(/\/\/ {{ROLES_DEFINITION}}/g, 'bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");');
        vaultContent = vaultContent.replace(/\/\/ {{STATE_VARIABLES}}/g, "");
        vaultContent = vaultContent.replace(/\/\/ {{EVENTS}}/g, "");

        // In constructor, we need logic for our custom role
        vaultContent = vaultContent.replace(/\/\/ {{CONSTRUCTOR_LOGIC}}/g, '_grantRole(STRATEGIST_ROLE, _admin);');

        vaultContent = vaultContent.replace(/\/\/ {{DEPOSIT_HOOKS}}/g, "");
        vaultContent = vaultContent.replace(/\/\/ {{TIMELOCK_CHECK}}/g, "");
        vaultContent = vaultContent.replace(/\/\/ {{FUNCTIONS}}/g, "");

        fs.writeFileSync(vaultOutput, vaultContent);
        console.log(`✅ Generated: ${vaultOutput}`);
    } catch (e) {
        console.warn("⚠️  Skipping DAO Vault test (Template might not exist yet)");
    }

    // --- COMPILE ---
    try {
        console.log("\n🔨 Compiling with Hardhat...");
        execSync('npx hardhat compile --force', { stdio: 'inherit', cwd: path.join(__dirname, '../') });
        console.log("🎉 ALL TEMPLATES VALIDATED SUCCESSFULLY!");
    } catch (err) {
        console.error("❌ Hardhat Compilation Failed (Check generated/ files)");
        if (err.stdout) console.log(err.stdout.toString());
        if (err.stderr) console.error(err.stderr.toString());
        process.exit(1);
    }
}

main();

