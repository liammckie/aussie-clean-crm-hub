
import { ChartConfig } from "./types"
import { DataKey } from "recharts/types/util/types"

// Update the function signature to accept Recharts' payload types
export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: { 
    dataKey?: string | number | DataKey<any>; 
    name?: string | number 
  },
  key?: string
) {
  // Convert dataKey to string if it's a function or other non-string/number type
  const dataKeyString = typeof payload.dataKey === "function" 
    ? "" // Skip function dataKeys
    : typeof payload.dataKey === "string" || typeof payload.dataKey === "number" 
      ? String(payload.dataKey) 
      : undefined;

  const configKey = key || dataKeyString;

  if (!configKey) {
    return undefined;
  }

  const nameString = payload.name !== undefined ? String(payload.name) : "";
  return config[configKey] || config[nameString] || undefined;
}
