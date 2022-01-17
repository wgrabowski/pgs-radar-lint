import { PGSRadarLinterFormatter } from "./model";
import { PGSRadarStatus } from "../radar-api/model";

export const defaultFormatter: PGSRadarLinterFormatter = function (results): string {
	let output = `No dependencies in ${PGSRadarStatus.Hold} status`;
	if (results[PGSRadarStatus.Hold].length) {
		output = `Dependencies in ${PGSRadarStatus.Hold} in PGS Software Tech Radar (https://radar.pgs-soft.com)`;
		output += results[PGSRadarStatus.Hold].map(entry => `\n- ${entry.name} (${entry.npmPackageName})`);
	}

	return output;
};