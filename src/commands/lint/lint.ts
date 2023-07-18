import { stderr, stdout } from "process";
import { readFileSync } from "fs";
import { cliFormatter, LinterResultsFormatter } from "./format";
import { getPackages, RadarPackageEntry, Status } from "../../api";
import { dirname, extname, join, resolve } from "path";
import { errorFormatter } from "../../errors";
import { getConfig, LinterConfig } from "./config";
import { getConfigFromUser } from "./init";
import { LinterResults } from "./model";

export async function lint(
	workingDirectory: string,
	formatter: LinterResultsFormatter = cliFormatter,
	noConfig = false
) {
	const config = noConfig
		? await getConfigFromUser().catch((error) => {
				stderr.write(errorFormatter(error));
		  })
		: await getConfig(workingDirectory).catch((error) => {
				stderr.write(errorFormatter(error));
		  });

	if (!config) {
		return;
	}

	const result = await lintPackages(workingDirectory, config as LinterConfig);

	stdout.write(formatter(result));
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
	radarsEntries: RadarPackageEntry[],
	status: Status
) {
	return radarsEntries.reduce((reduced, entry) => {
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
): Promise<LinterResults> {
	const radarIds = config.radars.map((radar) => radar.spreadsheetId);
	const radarNames = config.radars.map((radar) => radar.title);
	const dependencies = getDependencies(directoryPath);
	const radarsEntries = await Promise.all(
		radarIds.map((radarId) => getPackages(radarId))
	).then((items) =>
		items.flatMap((entry) => entry).filter((entry) => entry.packageName !== "0")
	);
	const packagesInRadar = radarsEntries
		.filter((entry) => dependencies.includes(entry.packageName))
		.map((entry) => entry.name);
	const packagesNotInRadar = dependencies.filter(
		(dependency) => !packagesInRadar.includes(dependency)
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
		dependencies: {
			all: dependencies,
			inRadar: packagesInRadar,
			notInRadar: packagesNotInRadar,
		},
		radarNames,
	};
}
