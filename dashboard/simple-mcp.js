#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

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
                name: "test_tool",
                description: "A simple test tool for ChainSpec",
                inputSchema: {
                    type: "object",
                    properties: {
                        message: { type: "string", description: "Test message" },
                    },
                    required: ["message"],
                },
            },
        ],
    };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "test_tool") {
        const message = String(args?.message || "Hello from ChainSpec MCP!");
        return {
            content: [{ type: "text", text: `Test response: ${message}` }],
        };
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