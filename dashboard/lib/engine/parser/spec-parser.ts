import fs from 'fs';
import path from 'path';
import { ContractSpec, FunctionSpec, FunctionParameter, StateVariable, EventSpec } from '../types/spec.types';
export class SpecParser {

    // Parse a markdown specification file
    // @param filePath - Path to the markdown file
    // @returns Parsed contract specification

    static parse(content: string): ContractSpec {
        return {
            contractName: this.extractContractName(content),
            securityRequirements: this.extractSecurityRequirements(content),
            functions: this.extractFunctions(content),
            stateVariables: this.extractStateVariables(content),
            events: this.extractEvents(content),
            stateInvariants: this.extractStateInvariants(content),
        };
    }

    static parseSpecFile(filePath: string): ContractSpec {
        const content = fs.readFileSync(filePath, 'utf-8');
        return this.parse(content);
    }
    // Extract contract name from markdown
    private static extractContractName(content: string): string {
        const match = content.match(/##\s*Contract Name\s*[\r\n]+([^\r\n]+)/i);
        if (!match) return 'UnnamedContract';

        let name = match[1].trim();
        // Replace spaces with underscores
        name = name.replace(/\s+/g, '_');
        // Remove invalid characters (keep strictly alphanumeric and underscores)
        name = name.replace(/[^a-zA-Z0-9_]/g, '');

        return name || 'UnnamedContract';
    }

    // Extract security requirements
    private static extractSecurityRequirements(content: string): string[] {
        const section = this.extractSection(content, 'Security Requirements');
        if (!section) return [];
        return section
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Extract function specifications
    private static extractFunctions(content: string): FunctionSpec[] {
        const functionRegex = /##\s*Function:\s*([^(]+)\(([^)]*)\)/g;
        const functions: FunctionSpec[] = [];
        let match;
        while ((match = functionRegex.exec(content)) !== null) {
            const functionName = match[1].trim();
            const paramsString = match[2].trim();

            // Find the section for this function
            const functionSection = this.extractFunctionSection(content, functionName, paramsString);

            functions.push({
                name: functionName,
                description: this.extractFieldFromSection(functionSection, 'Description'),
                parameters: this.parseParameters(paramsString),
                preconditions: this.extractListField(functionSection, 'Precondition'),
                postconditions: this.extractListField(functionSection, 'Postcondition'),
                security: this.extractFieldFromSection(functionSection, 'Security'),
                events: this.extractListField(functionSection, 'Events'),
                returns: this.extractFieldFromSection(functionSection, 'Returns'),
            });
        }
        return functions;
    }

    // Parse function parameters
    private static parseParameters(paramsString: string): FunctionParameter[] {
        if (!paramsString) return [];
        return paramsString.split(',').map(param => {
            const parts = param.trim().split(/\s+/);
            return {
                type: parts[0] || '',
                name: parts[1] || '',
            };
        });
    }
    // Extract state variables
    private static extractStateVariables(content: string): StateVariable[] {
        const section = this.extractSection(content, 'State Variables');
        if (!section) return [];
        const variables: StateVariable[] = [];
        const lines = section.split('\n').filter(line => line.trim().startsWith('-'));
        for (const line of lines) {
            const match = line.match(/-\s*`([^`]+)`\s*-\s*(.+)/);
            if (match) {
                const declaration = match[1].trim();
                const description = match[2].trim();

                // Parse the declaration to extract type and name
                // For complex types like "mapping(address => uint256) balances"
                // We need to find the last word as the variable name
                const parts = declaration.split(/\s+/);
                if (parts.length >= 2) {
                    const name = parts[parts.length - 1];
                    const type = parts.slice(0, -1).join(' ');

                    variables.push({
                        name: name,
                        type: type,
                        description: description,
                    });
                }
            }
        }
        return variables;
    }
    // Extract events
    private static extractEvents(content: string): EventSpec[] {
        const section = this.extractSection(content, 'Events');
        if (!section) return [];
        const events: EventSpec[] = [];
        const lines = section.split('\n').filter(line => line.trim().startsWith('-'));
        for (const line of lines) {
            const match = line.match(/-\s*`([^(]+)\(([^)]*)\)`\s*-\s*(.+)/);
            if (match) {
                events.push({
                    name: match[1].trim(),
                    parameters: match[2].trim(),
                    description: match[3].trim(),
                });
            }
        }
        return events;
    }
    // Extract state invariants
    private static extractStateInvariants(content: string): string[] {
        const section = this.extractSection(content, 'State Invariants');
        if (!section) return [];
        return section
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^-\s*/, '').replace(/`/g, '').trim());
    }
    // Extract a section from markdown based on heading
    private static extractSection(content: string, heading: string): string {
        const regex = new RegExp(`##\\s*${heading}\\s*\\n+([\\s\\S]*?)(?=\\n##|$)`, 'i');
        const match = content.match(regex);
        return match ? match[1].trim() : '';
    }
    // Extract function section content
    private static extractFunctionSection(content: string, functionName: string, params: string): string {
        const escapedName = functionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`##\\s*Function:\\s*${escapedName}\\([^)]*\\)([\\s\\S]*?)(?=\\n##|$)`, 'i');
        const match = content.match(regex);
        return match ? match[1].trim() : '';
    }
    // Extract a field value from a section
    private static extractFieldFromSection(section: string, fieldName: string): string {
        const regex = new RegExp(`-\\s*\\*\\*${fieldName}\\*\\*:\\s*(.+)`, 'i');
        const match = section.match(regex);
        return match ? match[1].trim() : '';
    }
    // Extract list field (can have multiple items)
    private static extractListField(section: string, fieldName: string): string[] {
        const line = this.extractFieldFromSection(section, fieldName);
        if (!line) return [];

        // Split by commas or return as single item
        return line.includes(',')
            ? line.split(',').map(item => item.trim())
            : [line];
    }
    // Save parsed spec to JSON file
    static saveToJSON(spec: ContractSpec, outputPath: string): void {
        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const json = JSON.stringify(spec, null, 2);
        fs.writeFileSync(outputPath, json, 'utf-8');
    }
    // Parse all spec files in a directory
    static parseDirectory(directoryPath: string): ContractSpec[] {
        const files = fs.readdirSync(directoryPath)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(directoryPath, file));
        return files.map(file => this.parseSpecFile(file));
    }
}