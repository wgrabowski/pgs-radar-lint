import * as colors from "ansi-colors";
import { PGSRadarStatus, RadarPackageEntry } from "../api";

const {blue, green, red, yellow, bgRed, bgGreen, bgYellow, bgBlue} = colors;


const PGSRadarStatusColor: Record<PGSRadarStatus, colors.StyleFunction> = {
	[PGSRadarStatus.Hold]: red.bold,
	[PGSRadarStatus.Assess]: yellow.bold,
	[PGSRadarStatus.Trial]: blue.bold,
	[PGSRadarStatus.Adopt]: green.bold,
};

export const PGSRadarStatusColorInverted: Record<PGSRadarStatus, colors.StyleFunction> = {
	[PGSRadarStatus.Hold]: bgRed.bold,
	[PGSRadarStatus.Assess]: bgYellow.bold,
	[PGSRadarStatus.Trial]: bgBlue.bold,
	[PGSRadarStatus.Adopt]: bgGreen.bold,
};

export function getDecoratedStatusName(status:PGSRadarStatus):string{
	return PGSRadarStatusColor[status](status);
}
