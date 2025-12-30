#!/usr/bin/env node

// Simple test to see if MCP server can start
console.error("Starting MCP server test...");

try {
    const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
    const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
    const { ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
    
    console.error("MCP SDK loaded successfully");
    
    const server = new Server(
        {
            name: "test-mcp",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );
    
    // Add a simple tool
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "test_tool",
                    description: "A simple test tool",
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
    
    console.error("Server created successfully");
    
    async function run() {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Test MCP Server running on stdio");
    }
    
    run().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
    
} catch (error) {
    console.error("Error loading MCP:", error);
    process.exit(1);
}