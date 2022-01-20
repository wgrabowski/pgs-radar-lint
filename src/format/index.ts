import { PGSRadarLinterFormatter, PGSRadarStatusColor } from "./model";
import { PGSRadarEntry, PGSRadarStatus } from "../radar-api/model";

export const defaultFormatter: PGSRadarLinterFormatter = function (results): string {
	return listDependenciesInStatus(results, PGSRadarStatus.Hold);
};

export const summaryFormatter: PGSRadarLinterFormatter = function (results): string {
	let output = "";
	output += listDependenciesInStatus(results, PGSRadarStatus.Adopt);
	output += listDependenciesInStatus(results, PGSRadarStatus.Trial);
	output += listDependenciesInStatus(results, PGSRadarStatus.Assess);
	output += listDependenciesInStatus(results, PGSRadarStatus.Hold);

	return output;
};

export const jsonFormatter: PGSRadarLinterFormatter = function (results): string {
	return JSON.stringify(results);
};

function listDependenciesInStatus(results: Record<PGSRadarStatus, PGSRadarEntry[]>, status: PGSRadarStatus): string {
	let output = `No dependencies in ${PGSRadarStatusColor[status](status)} status`;
	if (results[status].length) {
		output = `Dependencies in ${PGSRadarStatusColor[status](status)} status`;
		output += results[status].map(entry => `\n- ${entry.name} (${entry.npmPackageName})`);
	}
	output += "\n";

	return output;
}