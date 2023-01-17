import { CONFIG_FILE_NAME, LinterConfig } from "./model";
import { existsSync, readFile } from "fs";
import { join } from "path";
import { getRadars } from "../api";
import { IncompatibleConfigError, InvalidConfigError } from "../errors";

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

export async function checkConfig(workingDirectory: string) {
	if (await isConfigInvalid(workingDirectory)) {
		throw new InvalidConfigError();
	}

	if (await isConfigIncompatible(workingDirectory)) {
		throw new IncompatibleConfigError();
	}
}

export function doesConfigExists(workingDirectory: string): boolean {
	return existsSync(getConfigFilePath(workingDirectory));
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
