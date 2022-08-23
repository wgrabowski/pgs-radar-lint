/* eslint-disable @typescript-eslint/no-explicit-any */
import { PGSRadarEntry, PGSRadarInfo, PGSRadarStatus } from "../radar-api/model.js";
import { getLatestRadarEntries } from "../radar-api/index.js";
import { PGSRadarPackageStatus } from "./model.js";
import { PGSRadarStatusColor } from "../format/model.js";

export async function status(radars: PGSRadarInfo[], packageNames: string[]): Promise<PGSRadarPackageStatus[]> {
	const entriesMap: any = await Promise.all(radars.map(radarToEntries)).then(e => e.flatMap(ee => ee));

	const mappedResult: PGSRadarPackageStatus[] = packageNames.map(packageName => ({
		packageName,
		statuses: entriesMap.reduce((result: any, em: any) => {
			result[em.name] = getPackageStatusInRadar(packageName, em.entries);
			return result;
		}, {})
	}));

	return Promise.resolve(mappedResult);
}

function getFormattedStatusInRadar(radarName: string, radarNamePadding: number, packageStatus: PGSRadarPackageStatus) {
	const status = packageStatus.statuses[radarName];
	const coloredStatus = status ? PGSRadarStatusColor[status](status) : "n/a";
	return `\t${radarName.padEnd(radarNamePadding)}: ${coloredStatus}`;
}

export function format(result: PGSRadarPackageStatus[]): string {
	let output = "";
	output += result.map(status => {
		let packageOutput = `\n${status.packageName}\n`;
		const radarNamePadding = Math.max(...Object.keys(status.statuses).map(key => key.length));
		packageOutput += Object.keys(status.statuses).map(radarName => getFormattedStatusInRadar(radarName, radarNamePadding, status)).join("\n");

		return packageOutput;
	}).join("\n");
	return `${output}\n`;
}


function radarToEntries(radar: PGSRadarInfo): Promise<unknown> {
	return getLatestRadarEntries(radar.spreadsheetId)
		.then(entries => ({
			name: radar.title,
			entries
		}));
}

function getPackageStatusInRadar(packageName: string, radarEntries: PGSRadarEntry[]): PGSRadarStatus | null {
	const matchingEntry = radarEntries.find(entry => entry?.npmPackageName === packageName);
	return matchingEntry?.status || null;
}
