#!/bin/bash

# MCP Server wrapper script
set -e

# Source environment variables
if [ -f ~/.chainspec.env ]; then
    source ~/.chainspec.env
fi

# Change to dashboard directory
cd /mnt/c/Users/Khushi/chainspec/dashboard

# Export environment variables
export OPENAI_API_KEY

# Run the simple MCP server first for testing
exec node simple-mcp.js