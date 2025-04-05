
import { ChartConfig } from "./types"

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: Record<string, any>,
  key: string
) {
  const configKey = payload?.dataKey || key || ""
  return config[configKey as keyof typeof config]
}
