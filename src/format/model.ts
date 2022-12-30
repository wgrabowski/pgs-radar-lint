import { RadarPackageEntry, PGSRadarStatus } from "../api/model";
import colors, { StyleFunction } from "ansi-colors";

const {blue, green, red, yellow, bgRed, bgGreen, bgYellow, bgBlue} = colors;


export type PGSRadarLinterFormatter = (results: Record<PGSRadarStatus, RadarPackageEntry[]>) => string;
export const PGSRadarStatusColor: Record<PGSRadarStatus, StyleFunction> = {
	[PGSRadarStatus.Hold]: red.bold,
	[PGSRadarStatus.Assess]: yellow.bold,
	[PGSRadarStatus.Trial]: blue.bold,
	[PGSRadarStatus.Adopt]: green.bold,
};

export const PGSRadarStatusColorInverted: Record<PGSRadarStatus, StyleFunction> = {
	[PGSRadarStatus.Hold]: bgRed.bold,
	[PGSRadarStatus.Assess]: bgYellow.bold,
	[PGSRadarStatus.Trial]: bgBlue.bold,
	[PGSRadarStatus.Adopt]: bgGreen.bold,
};
