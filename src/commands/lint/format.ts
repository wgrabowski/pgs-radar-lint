import { Status } from "../../api";
import { getDecoratedStatusName, getStringDecoratedByStatus } from "../../cli";
import { LinterResults } from "./model";

export type LinterResultsFormatter = (results: LinterResults) => string;

export const ciFormatter: LinterResultsFormatter = function (results): string {
	return listDependenciesInHoldStatus(results);
};

export const defaultFormatter: LinterResultsFormatter = function (
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

export const summaryFormatter: LinterResultsFormatter = function (
	results
): string {
	return listStats(results) + listDecoratedDependencies(results);
};

function listDependenciesInStatus(
	results: LinterResults,
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

function listDependenciesInHoldStatus(results: LinterResults): string {
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

function listStats(results: LinterResults) {
	let output = "xebia-radar-lint\n\n";

	output += `Checked ${results.dependencies.all.length} dependencies from package.json against Xebia Technology Radar\n`;
	output += `${
		results.dependencies.inRadar.length
	} included in radar (${results.radarNames.join(", ")})\n`;
	output += `${results[Status.Adopt].length
		.toString()
		.padEnd(3)} in ${getDecoratedStatusName(Status.Adopt)}  status\n`;
	output += `${results[Status.Assess].length
		.toString()
		.padEnd(3)} in ${getDecoratedStatusName(Status.Assess)} status\n`;
	output += `${results[Status.Trial].length
		.toString()
		.padEnd(3)} in ${getDecoratedStatusName(Status.Trial)}  status\n`;
	output += `${results[Status.Hold].length
		.toString()
		.padEnd(3)} in ${getDecoratedStatusName(Status.Hold)}   status\n`;

	output += "\n";

	return output;
}

function listDecoratedDependencies(results: LinterResults) {
	const statuses = [Status.Adopt, Status.Hold, Status.Trial, Status.Assess];

	let output = `All dependencies colored by status (${getDecoratedStatusName(
		Status.Adopt
	)}, ${getDecoratedStatusName(Status.Assess)}, ${getDecoratedStatusName(
		Status.Trial
	)}, ${getDecoratedStatusName(
		Status.Hold
	)}, no color - package not in radar).\n`;

	const colorByStatus = (name: string) => {
		let colorizedName = name;
		statuses.forEach((status) => {
			if (results[status].some((entry) => entry.packageName === name)) {
				colorizedName = getStringDecoratedByStatus(status, name);
			}
		});

		return colorizedName;
	};

	output +=
		" - " +
		results.dependencies.all.sort().map(colorByStatus).join("\n - ") +
		"\n";

	return output;
}
