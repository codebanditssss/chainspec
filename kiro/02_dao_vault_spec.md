# DAO Vault Specification

## Contract Name
DAOVault

## Security Requirements
- Role-based access control: Only designated roles can perform privileged actions
- Timelock mechanism: Withdrawals require waiting period for security
- Reentrancy protection: All external calls protected against reentrancy
- Pausable functionality: Admin can pause contract in emergencies
- State invariant: Total deposits equals sum of all user balances
- No overflow/underflow vulnerabilities (Solidity 0.8+)

## Function: constructor(address _token, address _admin)
- **Description**: Initialize the DAO vault with a specific ERC20 token and admin
- **Precondition**: Called once during deployment, _token and _admin must be valid addresses
- **Postcondition**: Token address set, admin granted DEFAULT_ADMIN_ROLE and STRATEGIST_ROLE
- **Security**: Public, initializes access control
- **Returns**: None

## Function: deposit(uint256 amount)
- **Description**: Deposit tokens into the vault
- **Precondition**: Caller has approved vault for \u003e= amount tokens, amount \u003e 0, contract not paused
- **Postcondition**: Caller's balance increases by amount, tokens transferred to vault, lastDepositTime updated
- **Security**: NonReentrant, WhenNotPaused, SafeERC20 transfer
- **Events**: Emit Deposit(msg.sender, amount)
- **Returns**: None

## Function: withdraw(uint256 amount)
- **Description**: Withdraw tokens from the vault
- **Precondition**: Caller has balance \u003e= amount, timelock period has passed since last deposit
- **Postcondition**: Caller's balance decreases by amount, tokens transferred to caller
- **Security**: NonReentrant, timelock check, SafeERC20 transfer
- **Events**: Emit Withdraw(msg.sender, amount)
- **Returns**: None

## Function: emergencyWithdraw()
- **Description**: Emergency withdrawal bypassing timelock (admin only)
- **Precondition**: Caller has DEFAULT_ADMIN_ROLE, caller has balance \u003e 0
- **Postcondition**: All of caller's balance withdrawn, balance set to 0
- **Security**: OnlyRole(DEFAULT_ADMIN_ROLE), NonReentrant
- **Events**: Emit EmergencyWithdraw(msg.sender, amount)
- **Returns**: None

## Function: pause()
- **Description**: Pause the contract to prevent deposits
- **Precondition**: Caller has DEFAULT_ADMIN_ROLE, contract not already paused
- **Postcondition**: Contract is paused, deposits disabled
- **Security**: OnlyRole(DEFAULT_ADMIN_ROLE)
- **Events**: Emit Paused(msg.sender)
- **Returns**: None

## Function: unpause()
- **Description**: Unpause the contract to allow deposits
- **Precondition**: Caller has DEFAULT_ADMIN_ROLE, contract is paused
- **Postcondition**: Contract is unpaused, deposits enabled
- **Security**: OnlyRole(DEFAULT_ADMIN_ROLE)
- **Events**: Emit Unpaused(msg.sender)
- **Returns**: None

## Function: grantStrategist(address account)
- **Description**: Grant strategist role to an account
- **Precondition**: Caller has DEFAULT_ADMIN_ROLE, account is valid address
- **Postcondition**: Account granted STRATEGIST_ROLE
- **Security**: OnlyRole(DEFAULT_ADMIN_ROLE)
- **Events**: Emit RoleGranted(STRATEGIST_ROLE, account, msg.sender)
- **Returns**: None

## Function: executeStrategy(address target, bytes calldata data)
- **Description**: Execute strategy on behalf of vault (strategist only)
- **Precondition**: Caller has STRATEGIST_ROLE, target is whitelisted contract
- **Postcondition**: External call executed, state updated based on strategy
- **Security**: OnlyRole(STRATEGIST_ROLE), NonReentrant, validate target
- **Events**: Emit StrategyExecuted(target, data)
- **Returns**: bytes result

## State Variables
- `IERC20 token` - The ERC20 token managed by this vault (immutable)
- `mapping(address => uint256) balances` - User deposit balances
- `mapping(address => uint256) lastDepositTime` - Last deposit timestamp for each user
- `uint256 timelockPeriod` - Minimum time between deposit and withdrawal (e.g., 1 day)
- `bytes32 STRATEGIST_ROLE` - Role identifier for strategy executors
- `mapping(address => bool) whitelistedTargets` - Approved contracts for strategy execution

## Events
- `Deposit(address indexed user, uint256 amount)` - Emitted on successful deposit
- `Withdraw(address indexed user, uint256 amount)` - Emitted on successful withdrawal
- `EmergencyWithdraw(address indexed admin, uint256 amount)` - Emitted on emergency withdrawal
- `StrategyExecuted(address indexed target, bytes data)` - Emitted when strategy is executed
- `Paused(address account)` - Emitted when contract is paused (inherited from OpenZeppelin)
- `Unpaused(address account)` - Emitted when contract is unpaused (inherited from OpenZeppelin)
- `RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)` - Emitted on role grants (inherited)

## State Invariants
- `sum(balances[all users]) <= token.balanceOf(address(this))`
- `balances[user] >= 0` (enforced by Solidity 0.8+)
- `lastDepositTime[user] <= block.timestamp`
- `timelockPeriod >= 0`
- "If paused, deposits revert"
- "Only whitelisted targets can be called in executeStrategy"

## Security Considerations

### Access Control Matrix
| Function | Public | STRATEGIST_ROLE | DEFAULT_ADMIN_ROLE |
|----------|--------|-----------------|-------------------|
| deposit() | ✓ | ✓ | ✓ |
| withdraw() | ✓ | ✓ | ✓ |
| emergencyWithdraw() | - | - | ✓ |
| pause() | - | - | ✓ |
| unpause() | - | - | ✓ |
| grantStrategist() | - | - | ✓ |
| executeStrategy() | - | ✓ | ✓ |

### Reentrancy Protection
- All functions with external calls use `nonReentrant` modifier
- State changes occur before external calls (Checks-Effects-Interactions)
- SafeERC20 used for all token transfers

### Timelock Mechanism
- Prevents flash loan attacks
- Users must wait `timelockPeriod` after deposit before withdrawal
- Admin emergency withdraw bypasses timelock (for genuine emergencies)

### Pausability
- Admin can pause to freeze deposits during security incidents
- Withdrawals still allowed when paused (users can exit)
- Cannot pause if already paused (prevents state confusion)
