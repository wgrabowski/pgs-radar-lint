import * as colors from "ansi-colors";
import { PGSRadarStatus, RadarPackageEntry } from "../api";

const {
	blue,
	green,
	red,
	yellow,
	bgRed,
	bgGreen,
	bgYellow,
	bgBlue,
	bgYellowBright,
} = colors;

const PGSRadarStatusColor: Record<PGSRadarStatus, colors.StyleFunction> = {
	[PGSRadarStatus.Hold]: red.bold,
	[PGSRadarStatus.Assess]: yellow.bold,
	[PGSRadarStatus.Trial]: blue.bold,
	[PGSRadarStatus.Adopt]: green.bold,
};

export function getDecoratedStatusName(status: PGSRadarStatus): string {
	return PGSRadarStatusColor[status](status);
}

export function getErrorTitle(text: string): string {
	return `${red(text)}`;
}
