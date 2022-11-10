import { readFileSync } from "fs";
import { dirname, extname, join, resolve } from "path";
import { PGSRadarLinterConfig } from "../config/model";
import { getLatestRadarEntries } from "../radar-api/index.js";
import { RadarPackageEntry, PGSRadarStatus } from "../radar-api/model";

export function getDependencies(directoryPath: string): string[] {
	const dependencies: string[] = [];
	const normalizedPath = resolve(extname(directoryPath) ? dirname(directoryPath) : directoryPath);
	const packageJson = readFileSync(join(normalizedPath, "package.json"), {encoding: "utf-8"});
	const parsedPackageJson = JSON.parse(packageJson);

	if (parsedPackageJson.dependencies) {
		dependencies.push(...Object.keys(parsedPackageJson.dependencies));
	}
	if (parsedPackageJson.devDependencies) {
		dependencies.push(...Object.keys(parsedPackageJson.devDependencies));
	}
	if (parsedPackageJson.optionalDependencies) {
		dependencies.push(...Object.keys(parsedPackageJson.optionalDependencies));
	}

	return dependencies;
}

function getPackagesByStatus(radarsEntries: Awaited<RadarPackageEntry[]>[], status: PGSRadarStatus) {
	return radarsEntries.flatMap(entry => entry).reduce((reduced, entry) => {
		if (entry.status === status) {
			reduced.set(entry.packageName, entry);
		}

		return reduced;
	}, new Map<string, RadarPackageEntry>());
}

// filter dependencies that are matching list of packages from radar
function getMatchingDependencies(dependencies: string[], packagesOnHold: Map<string, RadarPackageEntry>) {
	return dependencies.filter(dependency => packagesOnHold.has(dependency)).map(name => packagesOnHold.get(name)) as RadarPackageEntry[];
}

export async function lint(directoryPath: string, config: PGSRadarLinterConfig): Promise<Record<PGSRadarStatus, RadarPackageEntry[]>> {
	const radarIds = config.radars.map(radar => radar.spreadsheetId);
	const dependencies = getDependencies(directoryPath);
	const radarsEntries = await Promise.all(radarIds.map(radarId => getLatestRadarEntries(radarId)));

	return {
		[PGSRadarStatus.Adopt]: getMatchingDependencies(dependencies, getPackagesByStatus(radarsEntries, PGSRadarStatus.Adopt)),
		[PGSRadarStatus.Assess]: getMatchingDependencies(dependencies, getPackagesByStatus(radarsEntries, PGSRadarStatus.Assess)),
		[PGSRadarStatus.Trial]: getMatchingDependencies(dependencies, getPackagesByStatus(radarsEntries, PGSRadarStatus.Trial)),
		[PGSRadarStatus.Hold]: getMatchingDependencies(dependencies, getPackagesByStatus(radarsEntries, PGSRadarStatus.Hold)),
	};
}
