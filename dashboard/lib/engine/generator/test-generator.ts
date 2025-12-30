import path from 'path';
import { SpecParser } from '../parser/spec-parser';
import { SolidityGenerator } from './generator';

/**
 * Test the complete ChainSpec pipeline:
 * Spec (Markdown) -> Parser (JSON) -> Generator (Solidity)
 */
async function testGenerator() {
    console.log('🚀 ChainSpec Generator Test\n');

    // Step 1: Parse the spec
    console.log('1️⃣ Parsing specification...');
    const specPath = path.join(__dirname, '../../kiro/01_erc20.md');
    const spec = SpecParser.parseSpecFile(specPath);

    console.log(`   ✅ Parsed contract: ${spec.contractName}`);
    console.log(`   - Functions: ${spec.functions.length}`);
    console.log(`   - State Variables: ${spec.stateVariables.length}`);
    console.log(`   - Events: ${spec.events.length}`);
    console.log(`   - Security Requirements: ${spec.securityRequirements.length}\n`);

    // Step 2: Save parsed JSON for inspection
    console.log('2️⃣ Saving parsed JSON...');
    const jsonPath = path.join(__dirname, '../../output/MyToken.json');
    SpecParser.saveToJSON(spec, jsonPath);
    console.log(`   ✅ Saved to: ${jsonPath}\n`);

    // Step 3: Generate Solidity contract
    console.log('3️⃣ Generating Solidity contract...');
    const outputPath = SolidityGenerator.generateFromSpec(spec, 'ERC20_Template');
    console.log(`   ✅ Generated: ${outputPath}\n`);

    // Step 4: Display summary
    console.log('📊 Summary:');
    console.log(`   Input:  ${specPath}`);
    console.log(`   JSON:   ${jsonPath}`);
    console.log(`   Output: ${outputPath}`);
    console.log('\n✨ Pipeline complete! Next steps:');
    console.log('   1. Review the generated contract');
    console.log('   2. Compile with: cd contracts && npm run compile');
    console.log('   3. Run tests with: cd contracts && npm test');
}

// Run the test
testGenerator().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
