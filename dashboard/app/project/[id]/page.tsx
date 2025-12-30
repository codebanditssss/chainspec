"use client";

import { useState, use } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Play, Save, CheckCircle2, AlertTriangle, FileText, Code2 } from "lucide-react";

// Mock Data (Simulating what parser would output)
const mockSpec = `# ECO Token Specification

## Security Requirements
1. **Access Control**: Only the admin can mint.
2. **Pausable**: Emergency stop mechanism required.

## Function: mint(to, amount)
- Precondition: Caller is admin
- Postcondition: Balance increases
`;

const mockSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ECOToken is ERC20, Ownable, Pausable {
    constructor() ERC20("ECO Token", "ECO") Ownable(msg.sender) {}

    // Security: Controlled by Ownable
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Hook: Updates strict hierarchy
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20)
        whenNotPaused
    {
        super._update(from, to, value);
    }
}`;

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isCompiling, setIsCompiling] = useState(false);
    const [showCode, setShowCode] = useState(false);

    const [generatedCode, setGeneratedCode] = useState("");
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        setIsCompiling(true);
        setError("");

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markdown: mockSpec }) // In future, use editor state
            });
            const data = await res.json();

            if (data.success) {
                setGeneratedCode(data.code);
                setShowCode(true);
            } else {
                console.error("Generation failed:", data.error);
                setError(data.error);
            }
        } catch (err) {
            console.error("API Call failed:", err);
            setError("Failed to connect to generator engine.");
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            {/* Toolbar */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-background">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">ID: {id}</Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        Draft
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Spec
                    </Button>
                    <Button size="sm" onClick={handleGenerate} disabled={isCompiling}>
                        {isCompiling ? (
                            <>Running Hooks...</>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Generate Code
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Split View */}
            <ResizablePanelGroup direction="horizontal" className="flex-1">

                {/* LEFT: Specification (Markdown) */}
                <ResizablePanel>
                    <div className="h-full flex flex-col">
                        <div className="h-10 bg-muted/30 border-b flex items-center px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <FileText className="mr-2 h-4 w-4" />
                            Kiro Specification (Input)
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{mockSpec}</ReactMarkdown>
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT: Generated Code (Solidity) */}
                <ResizablePanel>
                    <div className="h-full flex flex-col bg-[#1e1e1e]">
                        <div className="h-10 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4 text-xs font-medium text-gray-400">
                            <div className="flex items-center uppercase tracking-wider">
                                <Code2 className="mr-2 h-4 w-4" />
                                Generated Contract (Output)
                            </div>
                            {showCode && (
                                <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Validated
                                </Badge>
                            )}
                        </div>

                        {showCode ? (
                            <div className="flex-1 overflow-auto">
                                <SyntaxHighlighter
                                    language="solidity"
                                    style={vs2015}
                                    customStyle={{ margin: 0, height: '100%', fontSize: '14px', lineHeight: '1.5' }}
                                    showLineNumbers={true}
                                >
                                    {generatedCode}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center opacity-50">
                                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                    <Play className="h-8 w-8 ml-1" />
                                </div>
                                <h3 className="font-semibold text-lg">Ready to Generate</h3>
                                <p className="text-sm max-w-xs mt-2">
                                    Write your specs on the left, then click "Generate Code" to trigger the Agent Hooks.
                                </p>
                            </div>
                        )}

                        {/* Security Analysis Panel (Bottom Tab) */}
                        {showCode && (
                            <div className="h-48 border-t border-[#3e3e42] bg-[#252526]">
                                <Tabs defaultValue="security" className="w-full h-full flex flex-col">
                                    <div className="px-4 border-b border-[#3e3e42]">
                                        <TabsList className="h-9 w-auto bg-transparent p-0">
                                            <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 px-4">
                                                Security Analysis
                                            </TabsTrigger>
                                            <TabsTrigger value="tests" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 px-4">
                                                Test Coverage
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                    <TabsContent value="security" className="flex-1 p-4 overflow-auto mt-0">
                                        <Alert className="bg-green-500/10 border-green-500/20 text-green-500 mb-3">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <AlertTitle>Access Control Verified</AlertTitle>
                                            <AlertDescription>
                                                `mint` function is correctly restricted to `onlyOwner`.
                                            </AlertDescription>
                                        </Alert>
                                        <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Gas Optimization Tip</AlertTitle>
                                            <AlertDescription>
                                                Consider using custom errors instead of require strings to save gas.
                                            </AlertDescription>
                                        </Alert>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    );
}
