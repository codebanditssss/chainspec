# ChainSpec System Architecture

## System Overview

```

                    Kiro IDE (Client)                     
                  Planning & Execution                    

                         MCP Protocol
                        

              ChainSpec MCP Server                        
       
    Tools:                                             
     parse_spec(markdown)  JSON                      
     generate_solidity(markdown)  .sol               
     generate_test_suite(markdown)  .test.js         
       

                        
          
                                     
                                     
          
  Spec Parser                  Generator      
  (TypeScript)                 (Templates)    
          
                                       
           JSON Spec                     Solidity
         
                        
                        
              
                 contracts/         
                  generated/        
                    SecureToken.sol 
              
                         
                         
              
                Hardhat Compiler    
              
                         
                         
              
                Ethereum Network    
                (Sepolia/Mainnet)   
              
```

---

## Layer Breakdown

### 1. Interface Layer

#### Kiro IDE
- **Role**: User interface for spec writing and tool invocation
- **Features**:
  - Markdown editor for specs
  - MCP client connection
  - Tool discovery and execution
  - File system management

#### Dashboard (Alternate)
- **Role**: Web-based alternative to Kiro IDE
- **Tech**: Next.js 16 + React 19
- **Features**:
  - Project list view
  - Split-screen editor (Spec | Code)
  - Real-time code generation
  - Deployment status

---

### 2. Integration Layer

#### MCP Server (`lib/mcp-server.ts`)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new Server({
  name: "chainspec-mcp",
  version: "1.0.0"
});

// Tool: parse_spec
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "parse_spec") {
    const content = String(args?.content);
    const parsed = SpecParser.parse(content);
    return { content: [{ type: "text", text: JSON.stringify(parsed) }] };
  }
  
  // ... other tools
});
```

**Communication**:
- Protocol: Model Context Protocol (stdio)
- Transport: stdin/stdout streams
- Format: JSON-RPC 2.0

---

### 3. Processing Layer

#### Spec Parser (`lib/engine/parser/spec-parser.ts`)

**Responsibilities**:
1. Extract contract name via regex
2. Parse security requirements
3. Extract function signatures with types
4. Validate spec completeness

**Key Functions**:
```typescript
class SpecParser {
  static parse(content: string): ContractSpec {
    return {
      contractName: this.extractContractName(content),
      securityRequirements: this.extractSecurityRequirements(content),
      functions: this.extractFunctions(content),
      stateVariables: this.extractStateVariables(content)
    };
  }
}
```

**Input**: Kiro markdown spec
**Output**: Structured JSON

---

#### Solidity Generator (`lib/engine/generator/generator.ts`)

**Responsibilities**:
1. Load contract template (ERC20, DAOVault, etc.)
2. Replace placeholders with spec data
3. Generate imports, modifiers, functions
4. Save to `contracts/generated/`

**Template System**:
```solidity
// Template: ERC20_Template.sol
contract {{CONTRACT_NAME}} is ERC20 {
    {{IMPORTS}}
    {{STATE_VARIABLES}}
    {{EVENTS}}
    
    constructor() ERC20("{{TOKEN_NAME}}", "{{SYMBOL}}") {
        {{CONSTRUCTOR_LOGIC}}
    }
    
    {{FUNCTIONS}}
    {{OVERRIDES}}
}
```

**Key Functions**:
```typescript
class SolidityGenerator {
  static generateContract(spec: ContractSpec): string {
    let template = this.loadTemplate(spec.contractType);
    template = this.replacePlaceholder(template, 'CONTRACT_NAME', spec.contractName);
    template = this.replacePlaceholder(template, 'FUNCTIONS', this.generateFunctions(spec));
    // ...
    return template;
  }
}
```

---

#### AI Test Generator (OpenAI Integration)

**Responsibilities**:
1. Receive contract spec
2. Call OpenAI GPT-4 with structured prompt
3. Generate Hardhat test suite
4. Return JavaScript test code

**Prompt Template**:
```
You are an expert Smart Contract Tester using Hardhat.
Given this specification: {spec}

Generate a comprehensive test suite that:
- Uses ethers.js v6
- Tests all functions
- Validates security rules
- Checks state invariants
```

---

### 4. Template Layer

#### Contract Templates

**ERC20_Template.sol**:
- Standard token functionality
- Ownable pattern
- Mint/burn capabilities
- Pausable (optional)

**DAOVault_Template.sol**:
- Multi-sig governance
- Timelock mechanism
- Proposal system
- Vote counting

**Custom Template Structure**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

{{IMPORTS}}

contract {{CONTRACT_NAME}} is {{INHERITANCE}} {
    {{STATE_VARIABLES}}
    {{EVENTS}}
    
    constructor({{CONSTRUCTOR_PARAMS}}) {{INHERITANCE_INIT}} {
        {{CONSTRUCTOR_LOGIC}}
    }
    
    {{MODIFIERS}}
    {{FUNCTIONS}}
    {{OVERRIDES}}
}
```

---

### 5. Deployment Layer

#### Hardhat Configuration (`hardhat.config.cjs`)
```javascript
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

#### Smart Deploy Script (`scripts/deploy.cjs`)
**Features**:
- Auto-detects latest generated contract
- Infers constructor arguments
- Deploys to configured network
- Verifies on Etherscan

---

## Data Flow

### Scenario: ERC20 Token Generation

```
1. User writes spec in Kiro:
   ---
   # ERC20 Token
   ## Contract Name: MyToken
   ## Function: mint(address to, uint256 amount)
   ---

2. Kiro invokes: generate_solidity(spec)
   
3. MCP Server receives request
   
4. SpecParser.parse(spec)
    { contractName: "MyToken", functions: [...] }
   
5. SolidityGenerator.generateContract(parsed)
    Loads ERC20_Template.sol
    Replaces {{CONTRACT_NAME}} with "MyToken"
    Generates mint() function with onlyOwner
    Returns complete Solidity code
   
6. MCP Server responds with .sol content
   
7. Kiro receives and displays code
   
8. User triggers deployment:
   npx hardhat run scripts/deploy.cjs --network sepolia
   
9. Contract deployed: 0x5FbDB...
```

---

## Security Architecture

### Access Control
- **Templates** enforce `onlyOwner` for privileged functions
- **Parser** validates security requirements from spec
- **Generator** adds appropriate modifiers

### Input Validation
- Spec parser checks for required fields
- Generator validates function signatures
- Deployment script verifies bytecode

### Audit Trail
- All generated files timestamped
- Git commits track changes
- Deployment addresses logged

---

## Scalability Considerations

### Horizontal Scaling
- MCP server: Stateless (can run multiple instances)
- Dashboard: Next.js SSR (edge-compatible)
- Templates: File-based (CDN-distributable)

### Vertical Scaling
- Parser: O(n) complexity (linear with spec size)
- Generator: O(m) complexity (linear with template size)
- AI calls: Rate-limited via OpenAI tier

### Caching Strategy
- Template files: In-memory cache
- Parsed specs: Redis (future)
- Generated contracts: Local file system

---

## Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | Next.js 16 | SSR, Turbopack, React 19 |
| Backend | TypeScript | Type safety, maintainability |
| MCP Server | @modelcontextprotocol/sdk | Kiro compatibility |
| AI | OpenAI GPT-4 | Best test generation quality |
| Blockchain | Hardhat + Ethers.js | Industry standard |
| UI | ShadCN + Tailwind | Modern, accessible |
| Templates | Solidity 0.8.20 | Latest stable with overflow protection |

---

## Future Architecture Enhancements

### Phase 5: Multi-Chain
```

  ChainSpec      

         
    
                             
  Ethereum  Polygon  Arbitrum  Base
```

### Phase 6: Plugin System
```
ChainSpec Core
     Template Plugin API
     Parser Plugin API
     Deployment Plugin API
```

### Phase 7: Cloud Deployment
```
AWS Lambda (MCP Server)
    
S3 (Template Storage)
    
DynamoDB (Spec Cache)
```

---

## Conclusion

ChainSpec's architecture is:
- **Modular**: Each layer is independent and testable
- **Extensible**: New templates and parsers easy to add
- **Scalable**: Stateless design supports horizontal scaling
- **Secure**: Multi-layer validation and audit trails
- **Kiro-Native**: MCP integration from the ground up

