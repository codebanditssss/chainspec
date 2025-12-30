import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import OpenAI from "openai";
import { SpecParser } from "./engine/parser/spec-parser";
import { SolidityGenerator } from "./engine/generator/generator";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize OpenAI (Make sure OPENAI_API_KEY is set in .env)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize MCP Server
const server = new Server(
    {
        name: "chainspec-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "parse_spec",
                description: "Parse a ChainSpec Markdown file into JSON structure",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: { type: "string", description: "The Markdown content" },
                    },
                    required: ["content"],
                },
            },
            {
                name: "generate_solidity",
                description: "Generate Solidity code from a Spec",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: { type: "string", description: "The Markdown content" },
                    },
                    required: ["content"],
                },
            },
            {
                name: "generate_test_suite",
                description: "Generate a Hardhat Test Suite using AI based on the Spec",
                inputSchema: {
                    type: "object",
                    properties: {
                        content: { type: "string", description: "The Markdown content" },
                    },
                    required: ["content"],
                },
            },
        ],
    };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "parse_spec") {
        const content = String(args?.content);
        try {
            const parsed = SpecParser.parse(content);
            return {
                content: [{ type: "text", text: JSON.stringify(parsed, null, 2) }],
            };
        } catch (err: any) {
            return {
                content: [{ type: "text", text: `Error: ${err.message}` }],
                isError: true,
            };
        }
    }

    if (name === "generate_solidity") {
        const content = String(args?.content);
        try {
            const parsed = SpecParser.parse(content);
            const code = SolidityGenerator.generateContract(parsed);
            return {
                content: [{ type: "text", text: code }],
            };
        } catch (err: any) {
            return {
                content: [{ type: "text", text: `Error: ${err.message}` }],
                isError: true,
            };
        }
    }

    if (name === "generate_test_suite") {
        const content = String(args?.content);
        try {
            // 1. Parse locally first to ensure validity
            const parsed = SpecParser.parse(content);

            // 2. Call OpenAI to write tests
            const completion = await openai.chat.completions.create({
                model: "gpt-4o", // or gpt-4-turbo
                messages: [
                    {
                        role: "system",
                        content: `You are an expert Smart Contract Tester using Hardhat.
                      Given a Kiro Specification JSONs, write a comprehensive Javascript test file.
                      - Use 'ethers' v6.
                      - Assume contract artifact name matches 'contractName'.
                      - Write 'describe' blocks for security rules.`,
                    },
                    {
                        role: "user",
                        content: JSON.stringify(parsed),
                    },
                ],
            });

            const testCode = completion.choices[0].message.content || "// No code generated";

            return {
                content: [{ type: "text", text: testCode }],
            };
        } catch (err: any) {
            return {
                content: [{ type: "text", text: `AI Error: ${err.message}` }],
                isError: true,
            };
        }
    }

    throw new Error(`Tool not found: ${name}`);
});

// Start Server
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("ChainSpec MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
