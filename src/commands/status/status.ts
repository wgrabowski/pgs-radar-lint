/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPackages, Radar, RadarPackageEntry, Status } from "../../api";
import { PackageStatus } from "./model";
import { getDecoratedStatusName } from "../../cli";

export async function status(
	radars: Radar[],
	packageNames: string[]
): Promise<PackageStatus[]> {
	const entriesMap: any = await Promise.all(radars.map(radarToEntries)).then(
		(entries) => entries.flatMap((value) => value)
	);

	const mappedResult: PackageStatus[] = packageNames.map((packageName) => ({
		packageName,
		statuses: entriesMap.reduce((result: any, em: any) => {
			result[em.name] = getPackageStatusInRadar(packageName, em.entries);
			return result;
		}, {}),
	}));

	return Promise.resolve(mappedResult);
}

function getFormattedStatusInRadar(
	radarName: string,
	radarNamePadding: number,
	packageStatus: PackageStatus
) {
	const status = packageStatus.statuses[radarName];
	const coloredStatus = status ? getDecoratedStatusName(status) : "n/a";
	return `\t${radarName.padEnd(radarNamePadding)}: ${coloredStatus}`;
}

export function format(result: PackageStatus[]): string {
	let output = "";
	output += result
		.map((status) => {
			let packageOutput = `\n${status.packageName}\n`;
			const radarNamePadding = Math.max(
				...Object.keys(status.statuses).map((key) => key.length)
			);
			packageOutput += Object.keys(status.statuses)
				.map((radarName) =>
					getFormattedStatusInRadar(radarName, radarNamePadding, status)
				)
				.join("\n");

			return packageOutput;
		})
		.join("\n");
	return `${output}\n`;
}

function radarToEntries(radar: Radar): Promise<unknown> {
	return getPackages(radar.spreadsheetId).then((entries) => ({
		name: radar.title,
		entries,
	}));
}

function getPackageStatusInRadar(
	packageName: string,
	radarEntries: RadarPackageEntry[]
): Status | null {
	const matchingEntry = radarEntries.find(
		(entry) => entry?.packageName === packageName
	);
	return matchingEntry?.status || null;
}
