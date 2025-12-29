# Security Pattern Mappings

This file defines the code snippets to be injected based on the `security` section of the Kiro Spec.

## 1. Access Control: "Ownable" (Simple)
**Trigger**: `security { accessControl: ["onlyOwner"] }`

**Injection: Imports**
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";
```

**Injection: Inheritance**
```solidity
Ownable
```

**Injection: Constructor**
```solidity
Ownable(msg.sender)
```

**Injection: Modifier Replacement**
*   Spec: `onlyOwner`
*   Code: `onlyOwner`

---

## 2. Access Control: "Roles" (Advanced)
**Trigger**: `security { accessControl: ["roles"] }`

**Injection: Imports**
```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";
```

**Injection: Inheritance**
```solidity
AccessControl
```

**Injection: State Variables**
```solidity
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
```

**Injection: Constructor**
```solidity
_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
_grantRole(ADMIN_ROLE, msg.sender);
```

**Injection: Modifier Replacement**
*   Spec: `onlyRole(MINTER)`
*   Code: `onlyRole(MINTER_ROLE)`

---

## 3. Emergency: "Pausable"
**Trigger**: `security { keywords: ["pausable"] }`

**Injection: Imports**
```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";
```

**Injection: Inheritance**
```solidity
Pausable
```

**Injection: Overrides**
```solidity
function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) whenNotPaused {
    super._update(from, to, value);
}
```
