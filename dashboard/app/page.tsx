"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Code, FileCode } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-20 pb-16">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <Badge variant="outline" className="px-4 py-1.5">
                        Built with Kiro IDE
                    </Badge>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Spec-First Smart Contract Framework
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Generate production-ready, secure Solidity contracts from markdown specifications using AI agents.
                        98% faster than manual coding.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 justify-center pt-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="gap-2">
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <a
                            href="https://github.com/YOUR_USERNAME/chainspec"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" variant="outline" className="gap-2">
                                <Code className="h-4 w-4" />
                                View on GitHub
                            </Button>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                        <div>
                            <div className="text-3xl font-bold">98%</div>
                            <div className="text-sm text-muted-foreground">Time Saved</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">Zero</div>
                            <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">2 min</div>
                            <div className="text-sm text-muted-foreground">Spec to Deploy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why ChainSpec?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                From markdown spec to deployed contract in under 2 minutes.
                                No boilerplate, no copy-paste.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Security First</h3>
                            <p className="text-muted-foreground">
                                Template-enforced security patterns. Every contract inherits
                                OpenZeppelin's battle-tested code.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileCode className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Kiro Powered</h3>
                            <p className="text-muted-foreground">
                                Integrated with Kiro IDE via MCP protocol. AI agents handle
                                code generation and testing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Write Your Specification</h3>
                                <p className="text-muted-foreground">
                                    Define your contract requirements in simple markdown.
                                    Specify security rules, functions, and access control.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Generate Solidity</h3>
                                <p className="text-muted-foreground">
                                    Click generate and watch AI produce production-ready Solidity
                                    with proper imports, modifiers, and security patterns.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Deploy to Ethereum</h3>
                                <p className="text-muted-foreground">
                                    One command deploys to Sepolia or Mainnet. Automatic compilation,
                                    verification, and Etherscan integration.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-12">
                        <Link href="/dashboard">
                            <Button size="lg">
                                Start Building
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <div>
                            Built with Kiro IDE for HackXios 2K25
                        </div>
                        <div className="flex gap-6">
                            <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                Kiro IDE
                            </a>
                            <a href="https://github.com/YOUR_USERNAME/chainspec" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                GitHub
                            </a>
                            <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                Etherscan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
