import { existsSync, readFile } from "fs";
import { join } from "path";

import { stdout } from "process";
import { CONFIG_FILE_NAME } from "../../config";
import { IncompatibleConfigError, InvalidConfigError } from "../../errors";
import { getRadars, Radar } from "../../api";

export interface LinterConfig {
	radars: Radar[];
}

export function getConfigFilePath(workingDirectory: string): string {
	return join(workingDirectory, CONFIG_FILE_NAME);
}

export function getConfig(workingDirectory: string): Promise<LinterConfig> {
	return new Promise((resolve, reject) => {
		readFile(
			getConfigFilePath(workingDirectory),
			{ encoding: "utf-8" },
			(err, data) => {
				if (err) {
					reject(err.message);
				} else {
					try {
						resolve(JSON.parse(data));
					} catch (e) {
						reject(new InvalidConfigError());
					}
				}
			}
		);
	});
}

export async function checkConfig(workingDirectory: string): Promise<boolean> {
	if (!doesConfigExists(workingDirectory)) {
		stdout.write(
			`No config file found in specified directory (${workingDirectory}).
			\n\rRun:\n\txebia-radar-lint --init to create a configuration file\n\txebia-radar-lint --no-config to run without config file\n`
		);
		return false;
	}

	if (await isConfigInvalid(workingDirectory)) {
		throw new InvalidConfigError();
	}

	if (await isConfigIncompatible(workingDirectory)) {
		throw new IncompatibleConfigError();
	}

	return true;
}

export function doesConfigExists(workingDirectory: string): boolean {
	return existsSync(getConfigFilePath(workingDirectory));
}

export function hasPackageJson(workingDirectory: string): boolean {
	return existsSync(join(workingDirectory, "package.json"));
}

async function isConfigIncompatible(
	workingDirectory: string
): Promise<boolean> {
	const config = await getConfig(workingDirectory);
	const availableRadars = await getRadars();

	const configRadarsIds = config.radars?.map(
		({ spreadsheetId }) => spreadsheetId
	);
	const availableRadarsIds = availableRadars.map(
		({ spreadsheetId }) => spreadsheetId
	);
	return configRadarsIds.some((radar) => !availableRadarsIds.includes(radar));
}

async function isConfigInvalid(workingDirectory: string) {
	const config = await getConfig(workingDirectory);
	// this checks if config has proper structure
	return (
		!Array.isArray(config.radars) ||
		config.radars.some(
			(entry) =>
				typeof entry.spreadsheetId === "undefined" ||
				typeof entry.title === "undefined"
		)
	);
}
