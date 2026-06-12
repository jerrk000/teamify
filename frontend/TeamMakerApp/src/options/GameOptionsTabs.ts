export const GAME_OPTIONS_TAGS = [
  { key: "random", label: "Random Teams" },
  { key: "custom", label: "Custom Teams" },
  { key: "keepscore", label: "Keep Score" }, 
  { key: "tournament", label: "Tournament" },
] as const

export type GameOptionsTagKey = typeof GAME_OPTIONS_TAGS[number]["key"]