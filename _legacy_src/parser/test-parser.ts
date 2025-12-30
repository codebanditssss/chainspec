import { SpecParser } from './spec-parser';
import path from 'path';
// Test the parser
const specPath = path.join(__dirname, '../../kiro/01_erc20.md');
const outputPath = path.join(__dirname, '../../output/erc20_spec.json');
console.log('Parsing specification file...');
console.log(`Input: ${specPath}\n`);
try {
    const spec = SpecParser.parseSpecFile(specPath);
    
    console.log('Parsing successful!\n');
    console.log('Parsed Contract Specification:');
    console.log('━'.repeat(50));
    console.log(`Contract Name: ${spec.contractName}`);
    console.log(`Security Requirements: ${spec.securityRequirements.length} items`);
    console.log(`Functions: ${spec.functions.length} items`);
    console.log(`State Variables: ${spec.stateVariables.length} items`);
    console.log(`Events: ${spec.events.length} items`);
    console.log(`State Invariants: ${spec.stateInvariants.length} items`);
    console.log('━'.repeat(50));
    
    console.log('\nSecurity Requirements:');
    spec.securityRequirements.forEach((req, i) => {
        console.log(`  ${i + 1}. ${req}`);
    });
    
    console.log('\nFunctions:');
    spec.functions.forEach((func, i) => {
        console.log(`  ${i + 1}. ${func.name}(${func.parameters.map(p => `${p.type} ${p.name}`).join(', ')})`);
        console.log(`     → ${func.description}`);
    });
    
    // Save to JSON
    SpecParser.saveToJSON(spec, outputPath);
    console.log(`\nSaved to: ${outputPath}`);
    
} catch (error) {
    console.error('Error parsing specification:', error);
    process.exit(1);
}