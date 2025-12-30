"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Terminal, Cloud, Shield, Cpu, Lock } from "lucide-react";

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Header */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Badge variant="outline" className="font-mono">
                        MISSION BRIEF: PROTOCOL ALPHA
                    </Badge>
                </div>
            </div>

            <main className="container max-w-3xl mx-auto px-4 py-16 space-y-16">

                {/* Hero Section */}
                <section className="space-y-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        The Future is <span className="text-primary">Agentic</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        ChainSpec is currently built as a <strong className="text-foreground">Local-First Agent</strong> to ensure maximum security for your private keys and codebase. The fully hosted Cloud OS is coming in Q3 2026.
                    </p>
                </section>

                {/* The "Why Local?" narrative */}
                <section className="bg-secondary/20 rounded-2xl p-8 border border-secondary/50">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Shield className="h-6 w-6 text-purple-500" />
                        Why Local-First?
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            Smart contracts manage millions in assets. Trusting a web-based editor with your deployment keys is a security risk.
                            ChainSpec runs <strong>directly on your machine</strong>—your keys never leave your device.
                        </p>
                        <p>
                            By integrating seamlessly with your local filesystem via <strong>Model Context Protocol (MCP)</strong>, our AI agents can:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Audit your entire repo context, not just one file.</li>
                            <li>Run comprehensive test suites locally using Hardhat.</li>
                            <li>Deploy using your local wallet configuration safely.</li>
                        </ul>
                    </div>
                </section>

                {/* Setup Steps */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Terminal className="h-6 w-6 text-green-500" />
                        Quick Start Protocol
                    </h2>

                    <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-px before:bg-border/50">

                        {/* Step 1 */}
                        <div className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold">1</div>
                            <h3 className="text-lg font-semibold mb-2">Clone the Architect</h3>
                            <code className="block bg-black/60 p-4 rounded-lg font-mono text-sm text-green-400 mb-2">
                                git clone https://github.com/codebanditssss/chainspec.git
                            </code>
                            <p className="text-sm text-muted-foreground">Initialize the codebase on your secure local environment.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold">2</div>
                            <h3 className="text-lg font-semibold mb-2">Ignite the Agent</h3>
                            <code className="block bg-black/60 p-4 rounded-lg font-mono text-sm text-green-400 mb-2">
                                ./start-chainspec.bat
                            </code>
                            <p className="text-sm text-muted-foreground">
                                This one-click launcher starts the Dashboard, Kiro CLI, and MCP Server in harmony.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold">3</div>
                            <h3 className="text-lg font-semibold mb-2">Build & Deploy</h3>
                            <p className="text-sm text-muted-foreground">
                                Open <span className="text-foreground font-mono">localhost:3000</span> to start spec-ing. The agent handles the rest.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Future Roadmap */}
                <section className="bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center">
                    <Cloud className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Incoming: ChainSpec Cloud</h2>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        We are building a secure enclave execution environment that will allow you to run the full Agentic experience in the browser without compromising security.
                    </p>
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Launch: 2026
                    </Badge>
                </section>

            </main>
        </div>
    );
}
