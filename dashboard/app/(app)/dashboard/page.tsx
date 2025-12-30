"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode, ArrowRight, ShieldCheck, AlertTriangle, Clock } from "lucide-react";

// Mock Data - In real app, this comes from parsing the ./kiro folder
const projects = [
  {
    id: "01_erc20",
    name: "MyGameToken",
    type: "ERC20",
    status: "audit_ready",
    lastEdited: "2 hours ago",
    securityScore: 98,
    issues: 0,
  },
  {
    id: "02_dao_vault",
    name: "DAO Treasury Vault",
    type: "Governance",
    status: "in_progress",
    lastEdited: "5 hours ago",
    securityScore: 85,
    issues: 2,
  },
  {
    id: "03_nft_drop",
    name: "CyberPunk NFT",
    type: "ERC721",
    status: "draft",
    lastEdited: "1 day ago",
    securityScore: 40,
    issues: 5,
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your ChainSpec contracts and view security analysis.
          </p>
        </div>
        <Link href="/project/new">
          <Button>
            <FileCode className="mr-2 h-4 w-4" />
            New Specification
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id} className="group">
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription>{project.type}</CardDescription>
                  </div>
                  <Badge variant={
                    project.status === 'audit_ready' ? 'default' :
                      project.status === 'in_progress' ? 'secondary' : 'outline'
                  }>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {project.lastEdited}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Security Score</span>
                    <span className={
                      project.securityScore > 90 ? "text-green-500 font-bold" :
                        project.securityScore > 70 ? "text-yellow-500 font-bold" :
                          "text-red-500 font-bold"
                    }>
                      {project.securityScore}/100
                    </span>
                  </div>
                  {/* Simple Progress Bar */}
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${project.securityScore > 90 ? "bg-green-500" :
                          project.securityScore > 70 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      style={{ width: `${project.securityScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/20 p-4">
                <div className="w-full flex items-center justify-between text-sm">
                  {project.issues === 0 ? (
                    <div className="flex items-center text-green-500">
                      <ShieldCheck className="mr-1.5 h-4 w-4" />
                      Secure
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-500">
                      <AlertTriangle className="mr-1.5 h-4 w-4" />
                      {project.issues} Spec Issues
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}

        {/* Create New Placeholder */}
        <Link href="/project/new" className="group">
          <Card className="h-full border-dashed hover:border-primary/50 hover:bg-muted/50 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCode className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Create Specification</h3>
            <p className="text-sm text-muted-foreground">Start a new smart contract from scratch using Kiro.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
