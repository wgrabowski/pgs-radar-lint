import { stderr, stdout } from "process";
import { readFileSync } from "fs";
import { defaultFormatter, PGSRadarLinterFormatter } from "./format";
import { getPackages, PGSRadarStatus, RadarPackageEntry } from "../../api";
import { getConfig } from "../../config";
import { dirname, extname, join, resolve } from "path";
import { PGSRadarLinterConfig } from "../../config/model";
import { errorFormatter } from "./errors";

export async function lint(
	workingDirectory: string,
	formatter: PGSRadarLinterFormatter = defaultFormatter
) {
	const config = await getConfig(workingDirectory).catch((error) =>
		stderr.write(errorFormatter(error))
	);

	if (!config) {
		return;
	}

	const result = await lintPackages(
		workingDirectory,
		config as PGSRadarLinterConfig
	);

	stdout.write(formatter(result));
	stdout.write("\n");
	process.exit(result.Hold.length > 0 ? 1 : 0);
}

function getDependencies(directoryPath: string): string[] {
	const dependencies: string[] = [];
	const normalizedPath = resolve(
		extname(directoryPath) ? dirname(directoryPath) : directoryPath
	);
	const packageJson = readFileSync(join(normalizedPath, "package.json"), {
		encoding: "utf-8",
	});
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

function getPackagesByStatus(
	radarsEntries: Awaited<RadarPackageEntry[]>[],
	status: PGSRadarStatus
) {
	return radarsEntries
		.flatMap((entry) => entry)
		.reduce((reduced, entry) => {
			if (entry.status === status) {
				reduced.set(entry.packageName, entry);
			}

			return reduced;
		}, new Map<string, RadarPackageEntry>());
}

/**
 * Filter dependencies that are matching list of packages from radar
 */

function getDependenciesIncludedInRadar(
	dependencies: string[],
	packagesOnHold: Map<string, RadarPackageEntry>
) {
	return dependencies
		.filter((dependency) => packagesOnHold.has(dependency))
		.map((name) => packagesOnHold.get(name)) as RadarPackageEntry[];
}

async function lintPackages(
	directoryPath: string,
	config: PGSRadarLinterConfig
): Promise<Record<PGSRadarStatus, RadarPackageEntry[]>> {
	const radarIds = config.radars.map((radar) => radar.spreadsheetId);
	const dependencies = getDependencies(directoryPath);
	const radarsEntries = await Promise.all(
		radarIds.map((radarId) => getPackages(radarId))
	);

	return {
		[PGSRadarStatus.Adopt]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, PGSRadarStatus.Adopt)
		),
		[PGSRadarStatus.Assess]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, PGSRadarStatus.Assess)
		),
		[PGSRadarStatus.Trial]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, PGSRadarStatus.Trial)
		),
		[PGSRadarStatus.Hold]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, PGSRadarStatus.Hold)
		),
	};
}
