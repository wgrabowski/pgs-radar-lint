import { CONFIG_FILE_NAME, PGSRadarLinterConfig } from "./model";
import { existsSync, readFile } from "fs";
import { join } from "path";
import { stdout } from "process";
import { CliFlagLong, CliFlagShort } from "../cli";
import { getRadars } from "../api";
import { InvalidConfigError } from "../commands/lint/errors";

export function getConfigFilePath(workingDirectory: string): string {
	return join(workingDirectory, CONFIG_FILE_NAME);
}

export function getConfig(workingDirectory: string): Promise<PGSRadarLinterConfig> {
	return new Promise((resolve, reject) => {
		readFile(getConfigFilePath(workingDirectory), {encoding: "utf-8"}, (err, data) => {
			if (err) {
				reject(err.message);
			} else {
				try {
					resolve(JSON.parse(data));
				} catch (e) {
					reject(new InvalidConfigError());
				}
			}
		});
	});
}

export function doesConfigExists(workingDirectory: string): boolean {
	return existsSync(getConfigFilePath(workingDirectory));
}

export async function isConfigIncompatible(workingDirectory: string): Promise<boolean> {
	const config = await getConfig(workingDirectory);
	const availableRadars = await getRadars();

	const configRadarsIds = config.radars.map(({spreadsheetId}) => spreadsheetId);
	const availableRadarsIds = availableRadars.map(({spreadsheetId}) => spreadsheetId);
	return configRadarsIds.some(radar => !availableRadarsIds.includes(radar));
}

function printNoConfigMessage(workingDirectory: string) {
	stdout.write(`No valid config file found in ${workingDirectory}.\n Use [${CliFlagLong.init} | ${CliFlagShort.init}] flag to create config file\n`);
}
