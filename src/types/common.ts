
export const DurationUnits = ["day", "week", "month", "year"] as const;
export type TDurationUnit = typeof DurationUnits[number];