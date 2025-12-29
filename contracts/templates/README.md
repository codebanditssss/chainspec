# ChainSpec Templates Library

This folder contains the **Raw Solidity Templates** used by the generator engine.

## Placeholder Syntax
We use a Double Curly Brace `{{ VARIABLE }}` syntax for injection.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `{{CONTRACT_NAME}}` | The Class Name of the contract | `MyGameToken` |
| `{{IMPORTS}}` | Dynamic list of OpenZeppelin imports | `import "@openzeppelin/..."` |
| `{{INHERITANCE}}` | Parent contracts | `ERC20, Ownable` |
| `{{CONSTRUCTOR}}` | Constructor logic | `constructor() ...` |
| `{{FUNCTIONS}}` | The generated functions from the Spec | `function mint() ...` |

## Rules
1. Templates must be valid Solidity syntax *except* for the placeholders.
2. Use `// {{SECTION}}` comments for large block injections to keep formatting clean.
