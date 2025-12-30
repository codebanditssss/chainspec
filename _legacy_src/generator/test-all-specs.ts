import path from 'path';
import { SpecParser } from '../parser/spec-parser';
import { SolidityGenerator } from './generator';

/**
 * Test generator with all specs in kiro/ folder
 */
async function testAllSpecs() {
    console.log(' ChainSpec - Testing All Specifications\n');

    const specs = [
        { file: '01_erc20.md', template: 'ERC20_Template' },
        { file: '03_erc20_spec.md', template: 'ERC20_Template' },
        { file: '04_dao_vault_spec.md', template: 'DAOVault_Template' }
    ];

    for (const { file, template } of specs) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(` Processing: ${file}`);
        console.log('='.repeat(60));

        try {
            // Parse spec
            const specPath = path.join(__dirname, '../../kiro', file);
            console.log(`1️⃣ Parsing ${file}...`);
            const spec = SpecParser.parseSpecFile(specPath);

            console.log(`    Contract: ${spec.contractName}`);
            console.log(`    Stats:`);
            console.log(`      - Functions: ${spec.functions.length}`);
            console.log(`      - State Variables: ${spec.stateVariables.length}`);
            console.log(`      - Events: ${spec.events.length}`);
            console.log(`      - Security Requirements: ${spec.securityRequirements.length}`);

            // Save JSON
            const jsonPath = path.join(__dirname, `../../output/${spec.contractName}.json`);
            SpecParser.saveToJSON(spec, jsonPath);
            console.log(`\n2️⃣ Saved JSON to: output/${spec.contractName}.json`);

            // Generate contract
            console.log(`\n3️⃣ Generating Solidity from ${template}...`);
            const outputPath = SolidityGenerator.generateFromSpec(spec, template);
            console.log(` Generated: ${outputPath}`);

        } catch (error) {
            console.error(` Error processing ${file}:`, (error as Error).message);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('All specifications processed!');
    console.log('='.repeat(60));
    console.log('\n Generated files:');
    console.log('   - contracts/generated/MyToken.sol (from 01_erc20.md)');
    console.log('   - contracts/generated/MyToken.sol (from 03_erc20_spec.md)');
    console.log('   - contracts/generated/DAOVault.sol (from 04_dao_vault_spec.md)');
    console.log('\n Next steps:');
    console.log('   1. Review generated contracts');
    console.log('   2. Implement TODO sections');
    console.log('   3. Compile: cd contracts && npx hardhat compile');
    console.log('   4. Test: cd contracts && npm test');
}

testAllSpecs().catch(error => {
    console.error(' Fatal error:', error);
    process.exit(1);
});
