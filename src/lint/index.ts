import { readFileSync } from "fs";
import { dirname, extname, join, resolve } from "path";
import { PGSRadarLinterConfig } from "../config/model";
import { getLatestRadarEntries } from "../radar-api";
import { PGSRadarEntry, PGSRadarStatus } from "../radar-api/model";

export function getDependencies(directoryPath: string): string[] {
	const dependencies: string[] = [];
	const normalizedPath = resolve(extname(directoryPath) ? dirname(directoryPath) : directoryPath);
	const packageJson = readFileSync(join(normalizedPath, "package.json"), {encoding: "utf-8"});
	const parsedPackgeJson = JSON.parse(packageJson);
	if (parsedPackgeJson.dependencies) {
		dependencies.push(...Object.keys(parsedPackgeJson.dependencies));
	}
	if (parsedPackgeJson.devDependencies) {
		dependencies.push(...Object.keys(parsedPackgeJson.devDependencies));
	}
	if (parsedPackgeJson.optionalDependencies) {
		dependencies.push(...Object.keys(parsedPackgeJson.optionalDependencies));
	}

	return dependencies;
}

function getPackagesByStatus(radarsEntries: Awaited<PGSRadarEntry[]>[], status: PGSRadarStatus) {
	return radarsEntries.flatMap(entry => entry).reduce((reduced, entry) => {
		if (entry.status === status) {
			reduced.set(entry.npmPackageName, entry);
		}

		return reduced;
	}, new Map<string, PGSRadarEntry>());
}

// filter dependencies that are matching list of packages from radar
function getMatchingDependencies(dependencies: string[], packagesOnHold: Map<string, PGSRadarEntry>) {
	return dependencies.filter(dependency => packagesOnHold.has(dependency)).map(name => packagesOnHold.get(name)) as PGSRadarEntry[];
}

export async function lint(directoryPath: string, config: PGSRadarLinterConfig): Promise<Record<PGSRadarStatus, PGSRadarEntry[]>> {
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