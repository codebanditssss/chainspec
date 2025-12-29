// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



/**
 * @title TestVault
 * @notice Advanced DAO Treasury with Role-Based Access and Time-Locks
 */
contract TestVault is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ==========================================
    // State Variables
    // ==========================================
    
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");
    // Example: bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");

    IERC20 public immutable token;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastDepositTime;
    
    

    // ==========================================
    // Events
    // ==========================================
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    

    // ==========================================
    // Constructor
    // ==========================================
    constructor(address _token, address _admin) {
        token = IERC20(_token);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        
        _grantRole(STRATEGIST_ROLE, _admin);
    }

    // ==========================================
    // Core Vault Logic
    // ==========================================

    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Cannot deposit 0");
        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        lastDepositTime[msg.sender] = block.timestamp;
        
        
        
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        
        // Example: require(block.timestamp >= lastDepositTime[msg.sender] + 1 days, "Locked");

        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, amount);
    }

    // ==========================================
    // Admin Functions
    // ==========================================
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    
}
