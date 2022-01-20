import { PGSRadarEntry, PGSRadarStatus } from "../radar-api/model";
import { blue, green, red, StyleFunction, yellow } from "ansi-colors";

export type PGSRadarLinterFormatter = (results: Record<PGSRadarStatus, PGSRadarEntry[]>) => string;
export const PGSRadarStatusColor: Record<PGSRadarStatus, StyleFunction> = {
	[PGSRadarStatus.Hold]: red.bold,
	[PGSRadarStatus.Assess]: yellow.bold,
	[PGSRadarStatus.Trial]: blue.bold,
	[PGSRadarStatus.Adopt]: green.bold,
};