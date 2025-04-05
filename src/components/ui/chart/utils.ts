
import { ChartConfig } from "./types"

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: { dataKey?: string | number; name?: string },
  key?: string
) {
  const configKey =
    key || (typeof payload.dataKey === "string" ? payload.dataKey : undefined)

  if (!configKey) {
    return undefined
  }

  return config[configKey] || config[payload.name || ""]
}
