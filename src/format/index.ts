import { PGSRadarLinterFormatter, PGSRadarStatusColor } from "./model";
import { PGSRadarStatus, RadarPackageEntry } from "../api/index";

export const defaultFormatter: PGSRadarLinterFormatter = function (results): string {
	return listDependenciesInHoldStatus(results);
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

function listDependenciesInStatus(results: Record<PGSRadarStatus, RadarPackageEntry[]>, status: PGSRadarStatus): string {
	let output = `No dependencies in ${PGSRadarStatusColor[status](status)} status`;
	if (results[status].length) {
		output = `Dependencies in ${PGSRadarStatusColor[status](status)} status`;
		output += results[status].map(entry => `\n- ${entry.packageName} (${entry.name})`);
	}
	output += "\n";

	return output;
}

function listDependenciesInHoldStatus(results: Record<PGSRadarStatus, RadarPackageEntry[]>): string {
	const decoratedStatusName = PGSRadarStatusColor[PGSRadarStatus.Hold](PGSRadarStatus.Hold);
	const holdDependencies = results[PGSRadarStatus.Hold];
	let output = `No dependencies in ${decoratedStatusName} status.`;
	if (holdDependencies.length) {
		output = `Dependencies in ${decoratedStatusName} status:`;
		output += holdDependencies.map(entry => {
			let entryOutput = `\n${entry.packageName}\n - radar entry name: ${entry.name}`;

			if (entry.replacementPackageName) {
				entryOutput += `\n - recommended alternative: ${entry.replacementPackageName}`;
			}
			return entryOutput;
		}).join("\n");
	}
	output += "\n";

	return output;
}
