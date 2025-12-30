# ChainSpec Demo Video Script (Kiro + Ethereum Track)
**Total Duration: 5-6 minutes**  
**Focus: Terminal-First, Kiro AI Agents, MCP Integration, Ethereum Deployment**

---

## 🎯 Demo Strategy

### Track Priorities
1. **Kiro IDE Track** (60% of video) - Show MCP server, AI agent workflows, CLI integration
2. **Ethereum Track** (30% of video) - Hardhat deployment, Sepolia testnet, Etherscan verification
3. **Open Innovation** (10% of video) - Spec-first paradigm, the "why"

### Screen Layout
- **Primary**: Terminal (80% of demo time)
- **Secondary**: VS Code / File Editor (for showing specs)
- **Bonus**: Web UI (1-2 minutes only, as a "convenience layer")

---

## 📋 Pre-Recording Setup

### Terminal Windows (Most Important!)
- **Terminal 1** (Top Left): **MCP Server** - `npm run mcp` in `chainspec/dashboard`
- **Terminal 2** (Top Right): **Kiro CLI** - WSL/Ubuntu showing Kiro prompts
- **Terminal 3** (Bottom): **Hardhat Deployment** - `chainspec/contracts`

### VS Code Setup
- Open `chainspec` workspace
- Have `kiro/01_erc20.md` spec file ready
- Show file tree in sidebar

### Files to Prepare
```markdown
# Create a fresh spec for demo
kiro/demo_token.md
```

Content:
```markdown
# SecureVault Specification

## Contract Name
SecureVault

## Type
ERC20 with Vesting

## Security Requirements
1. **Access Control**: Only admin can mint
2. **Time Locks**: Vesting schedule enforced
3. **Pausable**: Emergency stop mechanism

## Function: mint(address to, uint256 amount)
- **Precondition**: Caller is admin, contract not paused
- **Postcondition**: Balance increases
- **Security**: OnlyOwner modifier

## Function: vest(address beneficiary, uint256 amount, uint256 duration)
- **Precondition**: Beneficiary valid, amount > 0
- **Postcondition**: Vesting schedule created
```

---

## 🎬 Video Script (Terminal-Heavy)

### [0:00 - 0:20] HOOK - The Agent Revolution (20 seconds)

**Screen**: Black screen → Fast montage of:
- Terminal with Kiro logo ASCII art
- Code being written by AI (timelapse)
- Smart contract vulnerabilities in headlines

**Voiceover** (fast, exciting):
> "Smart contracts power billions in DeFi. But writing them? Hours of boilerplate, manual audits, deployment nightmares. What if an AI agent could do it all—from spec to deployed, verified contract—in under 2 minutes?"

**Text Overlay**:
```
The Problem:
❌ Manual Solidity boilerplate
❌ Security vulnerabilities  
❌ Complex deployment pipelines
```

**Transition**: Fade to ChainSpec logo

---

### [0:20 - 0:40] INTRODUCTION (20 seconds)

**Screen**: VS Code showing `kiro/HERO/planning.md` file

**Voiceover**:
> "Meet ChainSpec: a spec-first smart contract framework built with Kiro IDE. Using the Model Context Protocol, Kiro AI agents turn natural language specs into production-ready, audited Solidity contracts."

**Camera Path**:
1. Show file tree (highlight `kiro/` folder)
2. Open `kiro/HERO/planning.md` (show it's real documentation)
3. Scroll to "Kiro Integration" section

**Text Overlay**:
```
Built With:
✓ Kiro IDE (AI Agents)
✓ Model Context Protocol (MCP)
✓ Hardhat (Ethereum)
```

---

### [0:40 - 1:20] STEP 1: ONE COMMAND TO RULE THEM ALL (40 seconds)

**Screen**: Full terminal view (windowed, showing Desktop background)

**Terminal 1 (PowerShell)**:
```powershell
# In: C:\Users\Khushi\chainspec
PS C:\Users\Khushi\chainspec> .\start-chainspec.bat
```

**Action**:
1. Type the command slowly (show user typing)
2. Press Enter
3. **Show the magic**: Split screen opens automatically
   - Left pane: Dashboard starting (`npm run dev`)
   - Right pane: MCP Server starting (`npm run mcp`)

**Terminal Output** (show this clearly):
```
[ChainSpec Launcher]
→ Starting Dashboard...
→ Starting MCP Server...
→ Starting Kiro CLI...

✓ Dashboard: http://localhost:3000
✓ MCP Server: stdio transport ready
✓ Kiro CLI: Connected to MCP
```

**Voiceover**:
> "One command, one click. ChainSpec's launcher starts the entire stack: the web dashboard, the MCP server for AI agent communication, and the Kiro CLI—all synchronized and ready."

**Camera Focus**:
- Pause on the "✓" checkmarks (2 seconds each)
- Zoom in slightly on "MCP Server: stdio transport ready"

**Text Overlay**:
```
💡 What Just Happened?
→ Dashboard (Next.js) launched
→ MCP Server connected to Kiro
→ AI Agents activated
```

---

### [1:20 - 2:00] STEP 2: Writing Specs with Kiro (40 seconds)

**Screen**: Split screen - VS Code (60%) + Terminal 2 (40%)

**VS Code**:
- Open `kiro/demo_token.md` file
- Show the markdown spec (prepared earlier)
- Highlight "Security Requirements" section

**Terminal 2 (Kiro CLI in WSL)**:
```bash
# Kiro analyzes the spec
kiro> analyze spec kiro/demo_token.md

[Kiro Agent]
📄 Reading spec: demo_token.md
🔍 Detected: ERC20 with Vesting pattern
🔒 Security requirements: 3 found
   → Access Control (OnlyOwner)
   → Time Locks (Vesting)
   → Pausable mechanism

✓ Spec validated. Ready to generate.
```

**Voiceover**:
> "We write the spec in plain markdown. Kiro's AI agent reads the file, identifies patterns—like ERC20 with vesting—and extracts security requirements. It understands intent, not just syntax."

**Camera Path**:
1. Start on VS Code (show the spec)
2. Pan to terminal (show Kiro analyzing)
3. **Pause** on "Security requirements: 3 found" (2 seconds)

**Text Overlay** (animate in):
```
Kiro Agent Workflow:
1️⃣ Parse markdown spec
2️⃣ Identify contract patterns
3️⃣ Extract security requirements
4️⃣ Validate completeness
```

---

### [2:00 - 2:40] STEP 3: MCP Server in Action (40 seconds)

**Screen**: Terminal 1 (MCP Server logs) - FULL SCREEN

**MCP Server Terminal** (show live logs):
```
[MCP Server] Receiving request from Kiro CLI...
[Tool Called] parse_spec
  Input: kiro/demo_token.md
  
[Parser] Extracting contract name: SecureVault
[Parser] Identified template: ERC20_Template
[Parser] Security rules: Access Control, Pausable

[Tool Called] generate_contract
  Template: ERC20_Template
  Placeholders: {{CONTRACT_NAME}}, {{FUNCTIONS}}...
  
[Generator] Writing to: contracts/generated/SecureVault.sol
✓ Contract generated: 156 lines
```

**Voiceover**:
> "Behind the scenes, the MCP server is the bridge. Kiro CLI calls MCP tools—like 'parse spec' and 'generate contract'—through a standardized protocol. This is the Model Context Protocol in action: AI agents communicating with your codebase securely."

**Camera Focus**:
- Scroll slowly through the logs
- Pause on `[Tool Called] generate_contract` (2 seconds)

**Text Overlay**:
```
MCP Tools Exposed:
→ parse_spec (Parser)
→ generate_contract (Generator)
→ generate_tests (AI Test Gen)
```

---

### [2:40 - 3:20] STEP 4: AI-Generated Contract Review (40 seconds)

**Screen**: VS Code showing `contracts/generated/SecureVault.sol`

**Action**:
1. Open the generated file in VS Code
2. Scroll through the code (fast scroll, 5 seconds)
3. **Stop at key sections**:
   - Line 1-10: Imports (OpenZeppelin)
   - Line 15: `contract SecureVault is ERC20, Ownable, Pausable`
   - Line 30: `function mint(...) public onlyOwner`
   - Line 50: `function vest(...)` with time-lock logic

**Terminal 2 (Kiro CLI)**:
```bash
kiro> audit contracts/generated/SecureVault.sol

[Kiro Security Audit]
🔍 Scanning for vulnerabilities...

✓ Access Control: onlyOwner modifier present
✓ Reentrancy: No external calls in loops
✓ Integer Overflow: Using Solidity 0.8.20 (safe math)
✓ Pausable: Emergency stop implemented

⚠️ Gas Optimization Suggestion:
  → Line 30: Consider custom errors instead of require strings

Overall Security Score: 9.2/10 ✅
```

**Voiceover**:
> "The generated Solidity isn't just boilerplate. It inherits OpenZeppelin's battle-tested contracts, applies our security requirements, and even includes the vesting logic. Kiro's audit agent then scans for vulnerabilities—access control, reentrancy, overflows—all verified."

**Camera Path**:
1. Code scroll (5 sec)
2. Pan to terminal audit output (hold 5 sec)
3. Zoom in on "Security Score: 9.2/10"

---

### [3:20 - 4:00] STEP 5: Deploy to Ethereum Sepolia (40 seconds)

**Screen**: Terminal 3 (Hardhat deployment) - FULL SCREEN

**Terminal 3**:
```powershell
# In: C:\Users\Khushi\chainspec\contracts
PS> npx hardhat run scripts/deploy.cjs --network sepolia

Deploying SecureVault to Sepolia...
  
📡 Connecting to Sepolia RPC...
✓ Connected (Chain ID: 11155111)

💰 Deployer balance: 0.043 ETH
🚀 Deploying SecureVault...
  
⛓️  Deployment Tx: 0x7f3a2...
✓ Mined in block 5432087

📍 Contract deployed to: 0xABCDEF1234567890...

🔍 Verifying on Etherscan...
  → Submitting source code...
  → Waiting for confirmation...
  
✅ Verified! 
   https://sepolia.etherscan.io/address/0xABCDEF1234567890#code
```

**Voiceover**:
> "One command deploys to Sepolia testnet. Hardhat compiles the contract, deploys it, and automatically verifies the source code on Etherscan—no manual steps. This is the Ethereum track: real deployment, real verification, production-ready."

**Camera Focus**:
- Real-time terminal output (don't speed up!)
- Pause on "Contract deployed to: 0x..." (3 seconds)
- Pause on "✅ Verified!" (3 seconds)

**Text Overlay**:
```
Ethereum Deployment:
→ Compiled with Hardhat
→ Deployed to Sepolia Testnet
→ Auto-verified on Etherscan
```

---

### [4:00 - 4:30] STEP 6: Etherscan Verification Proof (30 seconds)

**Screen**: Browser (Etherscan Sepolia)

**Action**:
1. Click the Etherscan link from terminal (Ctrl+Click)
2. Browser opens to verified contract page
3. **Show**:
   - Green "Contract Source Code Verified" checkmark
   - The Solidity code visible on Etherscan
   - Scroll to the `mint()` function showing `onlyOwner`

**Voiceover**:
> "On Etherscan, our contract is live and verified. Anyone can audit the source code, interact with the contract, and see that it matches our spec. This is transparency. This is trust."

**Camera**:
- Zoom in on green checkmark (2 seconds)
- Scroll through the Solidity code on Etherscan (5 seconds)

---

### [4:30 - 5:00] STEP 7: The Frontend (Optional UI Layer) (30 seconds)

**Screen**: Browser at `localhost:3000` (quick tour)

**Action** (FAST - this is the "bonus"):
1. Show landing page (2 seconds)
2. Click "Get Started" → Dashboard (3 seconds)
3. Show the generated code in the right pane (5 seconds)
4. Click "Deployment" tab → Show "Live on Sepolia" badge (5 seconds)

**Voiceover**:
> "For developers who prefer a GUI, there's a web dashboard. Same spec, same AI engine, just wrapped in a Next.js interface. But the real power is in the terminal—where Kiro agents, MCP, and Hardhat meet."

**Text Overlay**:
```
Dashboard Features:
→ Spec editor
→ Live code preview
→ Deployment status
```

---

### [5:00 - 5:30] STEP 8: The Full Loop (30 seconds)

**Screen**: Quick montage (3 seconds per shot):
1. VS Code with spec file
2. Terminal showing MCP server logs
3. Kiro CLI running audit
4. Hardhat deployment output
5. Etherscan verified contract
6. Dashboard showing "Live" status

**Voiceover**:
> "From spec to deployed contract in under 2 minutes. ChainSpec combines the intelligence of Kiro AI agents, the security of local execution via MCP, and the production readiness of Ethereum tooling. It's not just code generation—it's a complete smart contract pipeline."

**Music**: Uplifting tech music crescendo

---

### [5:30 - 6:00] CLOSING: Open Innovation (30 seconds)

**Screen**: Terminal showing `kiro/HERO/planning.md` (back to the start)

**Voiceover**:
> "We built ChainSpec to solve a real problem: smart contract development is too slow and too risky. By applying spec-first design, AI agents, and open protocols like MCP, we're making Web3 development accessible, secure, and fast. Check out the repo, fork it, and build the future with us."

**Final Screen** (text overlay):
```
🚀 ChainSpec
   Spec-First Smart Contracts Powered by AI

Built With:
→ Kiro IDE
→ Model Context Protocol (MCP)
→ Ethereum (Hardhat + Sepolia)

github.com/codebanditssss/chainspec

Made for HackXios 2025
```

**End Screen**: 5 seconds hold, fade to black

---

## 📝 Exact Voiceover Script (What You'll Actually Say)

### Scene 1: Hook (0:00-0:20)
```
"Smart contracts power billions in DeFi. But writing them? Hours of boilerplate, 
manual audits, deployment nightmares. What if an AI agent could do it all—
from spec to deployed, verified contract—in under 2 minutes?"
```

### Scene 2: Introduction (0:20-0:40)
```
"Meet ChainSpec: a spec-first smart contract framework built with Kiro IDE. 
Using the Model Context Protocol, Kiro AI agents turn natural language specs 
into production-ready, audited Solidity contracts."
```

### Scene 3: One Command (0:40-1:20)
```
"One command, one click. ChainSpec's launcher starts the entire stack: 
the web dashboard, the MCP server for AI agent communication, and the Kiro CLI—
all synchronized and ready. This is what developer experience should be."
```

### Scene 4: Writing Specs (1:20-2:00)
```
"We write the spec in plain markdown. Kiro's AI agent reads the file, 
identifies patterns—like ERC-20 with vesting—and extracts security requirements. 
It understands intent, not just syntax. This is the Kiro advantage."
```

### Scene 5: MCP Server (2:00-2:40)
```
"Behind the scenes, the MCP server is the bridge. Kiro CLI calls MCP tools—
like 'parse spec' and 'generate contract'—through a standardized protocol. 
This is the Model Context Protocol in action: AI agents communicating 
with your codebase securely, locally, without sending data to the cloud."
```

### Scene 6: AI Audit (2:40-3:20)
```
"The generated Solidity isn't just boilerplate. It inherits OpenZeppelin's 
battle-tested contracts, applies our security requirements, and even includes 
the vesting logic. Kiro's audit agent then scans for vulnerabilities—
access control, reentrancy, overflows—all verified in seconds."
```

### Scene 7: Ethereum Deploy (3:20-4:00)
```
"One command deploys to Sepolia testnet. Hardhat compiles the contract, 
deploys it, and automatically verifies the source code on Etherscan—
no manual steps. This is the Ethereum track: real deployment, 
real verification, production-ready infrastructure."
```

### Scene 8: Etherscan Proof (4:00-4:30)
```
"On Etherscan, our contract is live and verified. Anyone can audit the source code, 
interact with the contract, and see that it matches our spec. 
This is transparency. This is trust. This is Web3 done right."
```

### Scene 9: Dashboard Bonus (4:30-5:00)
```
"For developers who prefer a GUI, there's a web dashboard. Same spec, 
same AI engine, just wrapped in a Next.js interface. But the real power 
is in the terminal—where Kiro agents, MCP, and Hardhat meet."
```

### Scene 10: Full Loop (5:00-5:30)
```
"From spec to deployed contract in under 2 minutes. ChainSpec combines 
the intelligence of Kiro AI agents, the security of local execution via MCP, 
and the production readiness of Ethereum tooling. It's not just code generation—
it's a complete smart contract pipeline."
```

### Scene 11: Closing (5:30-6:00)
```
"We built ChainSpec to solve a real problem: smart contract development 
is too slow and too risky. By applying spec-first design, AI agents, 
and open protocols like MCP, we're making Web3 development accessible, 
secure, and fast. Check out the repo, fork it, and build the future with us."
```

---

## 🎨 Key Visual Elements

### Timestamps Where You Emphasize Kiro
- **[0:40-1:20]**: One command starts MCP + Kiro
- **[1:20-2:00]**: Kiro agent analyzes spec
- **[2:00-2:40]**: MCP server logs (Kiro calling tools)
- **[2:40-3:20]**: Kiro audit agent scans code

### Timestamps Where You Emphasize Ethereum
- **[3:20-4:00]**: Hardhat deployment to Sepolia
- **[4:00-4:30]**: Etherscan verification proof

### Minimal Frontend Time
- **[4:30-5:00]**: Only 30 seconds on the web UI

---

## 🎯 Recording Tips

### Terminal Font Settings
- **Font**: JetBrains Mono or Fira Code (monospaced, clean)
- **Size**: 14-16pt (readable in 1080p video)
- **Theme**: Dark background with high-contrast text
- **Line height**: 1.4 (breathing room)

### Terminal Colors
- Success: `#00FF00` (bright green)
- Warnings: `#FFFF00` (yellow)
- Errors: `#FF0000` (red)
- Standard: `#FFFFFF` (white)

### Command Timing
- Type commands at **normal human speed** (don't instant paste)
- Pause **2 seconds** after executing before showing output
- Let output scroll naturally (don't speed up in recording, do it in edit)

### Camera Movements
- **Pan**: 0.5 seconds between terminals
- **Zoom**: 0.3 seconds to highlight specific lines
- **Hold**: 2-3 seconds on important checkmarks/results

---

## ✅ Pre-Flight Checklist

**Environment**:
- [ ] Windows desktop clean (no personal files visible)
- [ ] All 3 terminals ready but not started
- [ ] VS Code open to `chainspec` workspace
- [ ] `kiro/demo_token.md` file created
- [ ] `.env` configured with Sepolia RPC + Private Key
- [ ] Sepolia deployer wallet has 0.05+ ETH

**Audio**:
- [ ] Microphone tested (clear sound, no echo)
- [ ] Voiceover script printed (for reference)
- [ ] Quiet room (no background noise)

**Screen**:
- [ ] 1920x1080 resolution set
- [ ] OBS/ShareX ready to record at 60fps
- [ ] Cursor highlighting enabled (optional)

---

**You're ready to record a Kiro-heavy, terminal-first, Ethereum-track-focused demo! 🚀**