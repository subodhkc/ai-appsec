/**
 * MCP tool definitions — converts ToolDescriptor contracts into MCP tool metadata.
 *
 * Phase 0: descriptors only. Handlers are NOT implemented.
 * Do NOT advertise functional security tools through a runnable public server
 * if their handlers are not implemented.
 */
import { TOOL_DESCRIPTORS } from '../contracts/tool.js';
import type { ToolDescriptor } from '../contracts/tool.js';

/**
 * MCP tool metadata derived from ToolDescriptor contracts.
 * This is the data structure used to register tools with the MCP server.
 */
export interface McpToolMetadata {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly readOnly: boolean;
  readonly destructive: boolean;
  readonly openWorld: boolean;
}

/**
 * Get MCP tool metadata for all defined tools.
 * Tools are NOT registered with handlers in Phase 0.
 */
export function getToolMetadata(): readonly McpToolMetadata[] {
  return TOOL_DESCRIPTORS.map((descriptor: ToolDescriptor) => ({
    name: descriptor.name,
    title: descriptor.title,
    description: descriptor.description,
    readOnly: descriptor.readOnly,
    destructive: descriptor.destructive,
    openWorld: descriptor.openWorld,
  }));
}
