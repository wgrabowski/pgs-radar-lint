import { RadarPackageEntry, Status } from "../../api";
import { getDecoratedStatusName } from "../../cli";

export type LinterResultsFormatter = (
	results: Record<Status, RadarPackageEntry[]>
) => string;

export const defaultFormatter: LinterResultsFormatter = function (
	results
): string {
	return listDependenciesInHoldStatus(results);
};

export const summaryFormatter: LinterResultsFormatter = function (
	results
): string {
	let output = "";
	output += listDependenciesInStatus(results, Status.Adopt);
	output += listDependenciesInStatus(results, Status.Trial);
	output += listDependenciesInStatus(results, Status.Assess);
	output += listDependenciesInStatus(results, Status.Hold);

	return output;
};

export const jsonFormatter: LinterResultsFormatter = function (
	results
): string {
	return JSON.stringify(results);
};
function listDependenciesInStatus(
	results: Record<Status, RadarPackageEntry[]>,
	status: Status
): string {
	let output = `No dependencies in ${getDecoratedStatusName(status)} status`;
	if (results[status].length) {
		output = `Dependencies in ${getDecoratedStatusName(status)} status`;
		output += results[status].map(
			(entry) => `\n- ${entry.packageName} (${entry.name})`
		);
	}
	output += "\n";

	return output;
}

function listDependenciesInHoldStatus(
	results: Record<Status, RadarPackageEntry[]>
): string {
	const decoratedStatusName = getDecoratedStatusName(Status.Hold);
	const holdDependencies = results[Status.Hold];
	let output = `No dependencies in ${decoratedStatusName} status.`;
	if (holdDependencies.length) {
		output = `Dependencies in ${decoratedStatusName} status:`;
		output += holdDependencies
			.map((entry) => {
				let entryOutput = `\n${entry.packageName}\n - radar entry name: ${entry.name}`;

				if (entry.replacementPackageName) {
					entryOutput += `\n - recommended alternative: ${entry.replacementPackageName}`;
				}
				return entryOutput;
			})
			.join("\n");
	}
	output += "\n";

	return output;
}
