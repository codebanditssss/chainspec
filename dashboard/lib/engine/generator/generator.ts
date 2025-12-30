import fs from 'fs';
import path from 'path';
import { ContractSpec, FunctionSpec, StateVariable, EventSpec, FunctionParameter } from '../types/spec.types';

export class SolidityGenerator {
    private static readonly TEMPLATES_DIR = path.join(process.cwd(), '../contracts/templates');
    private static readonly OUTPUT_DIR = path.join(process.cwd(), '../contracts/generated');

    /**
     * Sanitize contract name to be valid Solidity identifier
     * - Removes spaces and converts to PascalCase
     * - Removes special characters except underscore
     * - Ensures it starts with a letter or underscore
     */
    private static sanitizeContractName(name: string): string {
        // Remove leading/trailing whitespace
        let sanitized = name.trim();

        // Convert spaces to PascalCase (e.g., "gandalfthe great" -> "GandalftheGreat")
        sanitized = sanitized.replace(/\s+(.)/g, (match, char) => char.toUpperCase());

        // Capitalize first letter
        sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);

        // Remove all characters except letters, numbers, and underscores
        sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '');

        // If name starts with a number, prefix with underscore
        if (/^[0-9]/.test(sanitized)) {
            sanitized = '_' + sanitized;
        }

        // If empty after sanitization, use default
        if (!sanitized) {
            sanitized = 'GeneratedContract';
        }

        return sanitized;
    }

    /**
     * Generate Solidity contract from specification
     * @param spec - Parsed contract specification
     * @param templateName - Template to use (e.g., 'ERC20_Template', 'DAOVault_Template')
     * @returns Generated Solidity code
     */
    static generateContract(spec: ContractSpec, templateName: string = 'ERC20_Template'): string {
        // Load template
        const templatePath = path.join(this.TEMPLATES_DIR, `${templateName}.sol`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        let template = fs.readFileSync(templatePath, 'utf-8');

        // Sanitize contract name
        const sanitizedName = this.sanitizeContractName(spec.contractName);

        // Replace placeholders
        template = this.replacePlaceholder(template, 'CONTRACT_NAME', sanitizedName);
        template = this.replacePlaceholder(template, 'IMPORTS', this.generateImports(spec));
        template = this.replacePlaceholder(template, 'INHERITANCE', this.generateInheritance(spec));
        template = this.replacePlaceholder(template, 'STATE_VARIABLES', this.generateStateVariables(spec.stateVariables));
        template = this.replacePlaceholder(template, 'EVENTS', this.generateEvents(spec.events));
        template = this.replacePlaceholder(template, 'CONSTRUCTOR_ARGS', this.generateConstructorArgs(spec));
        template = this.replacePlaceholder(template, 'CONSTRUCTOR_InHERITANCE', this.generateConstructorInheritance(spec));
        template = this.replacePlaceholder(template, 'CONSTRUCTOR_LOGIC', this.generateConstructorLogic(spec));
        template = this.replacePlaceholder(template, 'FUNCTIONS', this.generateFunctions(spec.functions));
        template = this.replacePlaceholder(template, 'OVERRIDES', '');

        // Template-specific placeholders
        if (templateName === 'DAOVault_Template') {
            template = this.replacePlaceholder(template, 'ROLES_DEFINITION', this.generateRoles(spec));
            template = this.replacePlaceholder(template, 'DEPOSIT_HOOKS', '// Custom deposit hooks');
            template = this.replacePlaceholder(template, 'TIMELOCK_CHECK', '// Custom timelock check');
        }

        return template;
    }

    /**
     * Replace template placeholder with value
     */
    private static replacePlaceholder(template: string, placeholder: string, value: string): string {
        const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
        return template.replace(regex, value);
    }

    /**
     * Generate imports based on contract requirements
     */
    private static generateImports(spec: ContractSpec): string {
        const imports: string[] = [];

        // Default imports for ERC20
        imports.push('import "@openzeppelin/contracts/token/ERC20/ERC20.sol";');

        // Check if owner functionality is needed
        const needsOwnable = spec.functions.some(fn =>
            fn.security.toLowerCase().includes('owner') ||
            fn.preconditions.some(pre => pre.toLowerCase().includes('owner'))
        );

        if (needsOwnable) {
            imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
        }

        return imports.join('\n');
    }

    /**
     * Generate inheritance list
     */
    private static generateInheritance(spec: ContractSpec): string {
        const inheritance: string[] = ['ERC20'];

        // Check if owner functionality is needed
        const needsOwnable = spec.functions.some(fn =>
            fn.security.toLowerCase().includes('owner') ||
            fn.preconditions.some(pre => pre.toLowerCase().includes('owner'))
        );

        if (needsOwnable) {
            inheritance.push('Ownable');
        }

        return inheritance.join(', ');
    }

    /**
     * Generate state variables declarations
     */
    private static generateStateVariables(variables: StateVariable[]): string {
        if (!variables || variables.length === 0) return '// No custom state variables';

        // Filter out ERC20 standard variables (inherited from OpenZeppelin)
        const standardVars = ['balances', 'allowances', 'totalSupply', 'name', 'symbol'];
        const customVars = variables.filter(v => !standardVars.includes(v.name));

        if (customVars.length === 0) return '// No custom state variables (standard ERC20 variables inherited)';

        return customVars
            .map(v => {
                // Handle complex types like mappings
                const typeDecl = v.type.includes('mapping') || v.type.includes('=>')
                    ? v.type.replace(/public/g, '').trim()
                    : v.type;
                return `${typeDecl} public ${v.name}; // ${v.description}`;
            })
            .join('\n    ');
    }

    /**
     * Generate event declarations
     */
    private static generateEvents(events: EventSpec[]): string {
        if (!events || events.length === 0) return '// No custom events';

        // Filter out standard ERC20 events (already defined in OpenZeppelin)
        const standardEvents = ['Transfer', 'Approval'];
        const customEvents = events.filter(e => !standardEvents.includes(e.name));

        if (customEvents.length === 0) return '// No custom events (standard ERC20 events inherited)';

        return customEvents
            .map(e => `event ${e.name}(${e.parameters}); // ${e.description}`)
            .join('\n    ');
    }

    /**
     * Generate constructor arguments
     */
    private static generateConstructorArgs(spec: ContractSpec): string {
        // Extract constructor function from spec
        const constructorFn = spec.functions.find(fn => fn.name.toLowerCase() === 'constructor');

        if (!constructorFn || constructorFn.parameters.length === 0) {
            return '';
        }

        return constructorFn.parameters
            .map(p => `${p.type} ${p.name}`)
            .join(', ');
    }

    /**
     * Generate constructor inheritance calls (e.g., ERC20("name", "symbol"))
     */
    private static generateConstructorInheritance(spec: ContractSpec): string {
        const constructorFn = spec.functions.find(fn => fn.name.toLowerCase() === 'constructor');

        if (!constructorFn) {
            return 'ERC20("DefaultToken", "DFT")';
        }

        // Extract name and symbol from parameters
        const nameParam = constructorFn.parameters.find(p => p.name.toLowerCase().includes('name'));
        const symbolParam = constructorFn.parameters.find(p => p.name.toLowerCase().includes('symbol'));

        if (nameParam && symbolParam) {
            return `ERC20(${nameParam.name}, ${symbolParam.name})`;
        }

        return 'ERC20("DefaultToken", "DFT")';
    }

    /**
     * Generate constructor logic
     */
    private static generateConstructorLogic(spec: ContractSpec): string {
        const constructorFn = spec.functions.find(fn => fn.name.toLowerCase() === 'constructor');

        if (!constructorFn) {
            return '// No constructor logic';
        }

        const logic: string[] = [];

        // Add comments for postconditions
        if (constructorFn.postconditions && constructorFn.postconditions.length > 0) {
            constructorFn.postconditions.forEach(post => {
                logic.push(`// ${post}`);
            });
        }

        return logic.join('\n        ');
    }

    /**
     * Generate function implementations
     */
    private static generateFunctions(functions: FunctionSpec[]): string {
        if (!functions || functions.length === 0) return '// No custom functions';

        // Filter out constructor and standard ERC20 functions (inherited)
        const standardFunctions = ['constructor', 'transfer', 'approve', 'transferfrom', 'balanceof', 'allowance'];

        // Filter out DAOVault template functions (already implemented)
        const daoVaultTemplateFunctions = ['deposit', 'withdraw', 'pause', 'unpause'];

        const customFunctions = functions.filter(fn => {
            const fnLower = fn.name.toLowerCase();
            return !standardFunctions.includes(fnLower) && !daoVaultTemplateFunctions.includes(fnLower);
        });

        if (customFunctions.length === 0) return '// Custom functions already implemented in template';

        return customFunctions.map(fn => this.generateFunction(fn)).join('\n\n    ');
    }

    /**
     * Generate individual function
     */
    private static generateFunction(fn: FunctionSpec): string {
        // Generate parameters
        const params = fn.parameters
            .map(p => `${p.type} ${p.name}`)
            .join(', ');

        // Determine visibility (default to public)
        const visibility = 'public';

        // Determine modifiers
        const modifiers: string[] = [];
        if (fn.security.toLowerCase().includes('owner')) {
            modifiers.push('onlyOwner');
        }

        const modifierStr = modifiers.length > 0 ? modifiers.join(' ') + ' ' : '';

        // Determine return type
        const returns = fn.returns ? `returns (${fn.returns})` : '';

        // Generate function body
        const body = this.generateFunctionBody(fn);

        // Generate documentation
        const docs = this.generateFunctionDocs(fn);

        return `${docs}
    function ${fn.name}(${params}) ${visibility} ${modifierStr}${returns} {
${body}
    }`;
    }

    /**
     * Generate function documentation
     */
    private static generateFunctionDocs(fn: FunctionSpec): string {
        const lines: string[] = ['/**'];

        const description = fn.description?.trim() || 'Function implementation';
        lines.push(`     * @notice ${description}`);

        if (fn.parameters && fn.parameters.length > 0) {
            fn.parameters.forEach(p => {
                lines.push(`     * @param ${p.name} ${p.type}`);
            });
        }

        if (fn.returns) {
            lines.push(`     * @return ${fn.returns}`);
        }

        if (fn.security) {
            lines.push(`     * @dev Security: ${fn.security}`);
        }

        lines.push('     */');

        return lines.join('\n    ');
    }

    /**
     * Generate function body with preconditions, logic, and postconditions
     */
    private static generateFunctionBody(fn: FunctionSpec): string {
        const body: string[] = [];

        // Add precondition checks
        if (fn.preconditions && fn.preconditions.length > 0) {
            body.push('// Preconditions:');
            fn.preconditions.forEach(pre => {
                body.push(`// ${pre}`);
                // Try to generate require statement
                const requireStmt = this.generateRequire(pre);
                if (requireStmt) {
                    body.push(requireStmt);
                }
            });
            body.push('');
        }

        // Add main logic placeholder
        body.push('// TODO: Implement function logic');

        // Add specific logic hints based on function name
        if (fn.name.toLowerCase() === 'mint') {
            body.push('// _mint(to, amount);');
        } else if (fn.name.toLowerCase() === 'transfer') {
            body.push('// _transfer(msg.sender, to, amount);');
        } else if (fn.name.toLowerCase() === 'approve') {
            body.push('// _approve(msg.sender, spender, amount);');
        } else if (fn.name.toLowerCase() === 'transferfrom') {
            body.push('// _spendAllowance(from, msg.sender, amount);');
            body.push('// _transfer(from, to, amount);');
        }

        // Add event emissions
        if (fn.events && fn.events.length > 0) {
            body.push('');
            fn.events.forEach(event => {
                body.push(`// emit ${event}`);
            });
        }

        // Add return statement if needed
        if (fn.returns) {
            body.push('');
            if (fn.returns.toLowerCase().includes('bool')) {
                body.push('return true;');
            }
        }

        return body.map(line => `        ${line}`).join('\n');
    }

    /**
     * Generate require statement from precondition
     */
    private static generateRequire(precondition: string): string | null {
        const lower = precondition.toLowerCase();

        // Check for common patterns
        if (lower.includes('caller must be') && lower.includes('owner')) {
            return '// require(msg.sender == owner, "Not owner");';
        }
        if (lower.includes('balance') && lower.includes('>=')) {
            return '// require(balances[msg.sender] >= amount, "Insufficient balance");';
        }
        if (lower.includes('address') && lower.includes('!= 0x0')) {
            return '// require(to != address(0), "Invalid address");';
        }

        return null;
    }

    /**
     * Generate roles for DAO templates
     */
    private static generateRoles(spec: ContractSpec): string {
        return 'bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");';
    }

    /**
     * Write generated contract to file
     */
    static writeToFile(contractCode: string, contractName: string, outputDir?: string): string {
        const dir = outputDir || this.OUTPUT_DIR;

        // Ensure output directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Sanitize filename
        const sanitizedName = this.sanitizeContractName(contractName);
        const filePath = path.join(dir, `${sanitizedName}.sol`);
        fs.writeFileSync(filePath, contractCode, 'utf-8');

        return filePath;
    }

    /**
     * Main pipeline: Parse spec -> Generate contract -> Write to file
     */
    static generateFromSpec(spec: ContractSpec, templateName: string = 'ERC20_Template', outputDir?: string): string {
        const contractCode = this.generateContract(spec, templateName);
        const filePath = this.writeToFile(contractCode, spec.contractName, outputDir);

        console.log(`✅ Generated contract: ${filePath}`);

        return filePath;
    }
}
