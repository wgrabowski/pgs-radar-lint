import { stderr, stdout } from "process";
import { readFileSync } from "fs";
import { defaultFormatter, LinterResultsFormatter } from "./format";
import { getPackages, RadarPackageEntry, Status } from "../../api";
import { getConfig } from "../../config";
import { dirname, extname, join, resolve } from "path";
import { LinterConfig } from "../../config/model";
import { errorFormatter } from "../../errors";

export async function lint(
	workingDirectory: string,
	formatter: LinterResultsFormatter = defaultFormatter
) {
	const config = await getConfig(workingDirectory).catch((error) => {
		stderr.write(errorFormatter(error));
	});

	if (!config) {
		return;
	}

	const result = await lintPackages(workingDirectory, config as LinterConfig);

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
	status: Status
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
	config: LinterConfig
): Promise<Record<Status, RadarPackageEntry[]>> {
	const radarIds = config.radars.map((radar) => radar.spreadsheetId);
	const dependencies = getDependencies(directoryPath);
	const radarsEntries = await Promise.all(
		radarIds.map((radarId) => getPackages(radarId))
	);

	return {
		[Status.Adopt]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, Status.Adopt)
		),
		[Status.Assess]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, Status.Assess)
		),
		[Status.Trial]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, Status.Trial)
		),
		[Status.Hold]: getDependenciesIncludedInRadar(
			dependencies,
			getPackagesByStatus(radarsEntries, Status.Hold)
		),
	};
}
