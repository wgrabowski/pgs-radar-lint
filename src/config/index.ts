import { CONFIG_FILE_NAME, PGSRadarLinterConfig } from "./model";
import { readFile, existsSync } from "fs";
import { join } from "path";
import { stdout } from "process";
import { CliFlagLong, CliFlagShort } from "../cli";


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
					reject("Invalid config file");
				}
			}
		});
	}).then((resolved) => resolved, (rejected) => {
		promptNoConfig(workingDirectory);
		return rejected;
	});
}

export function checkIfConfigExists(workingDirectory: string): boolean {
	return existsSync(getConfigFilePath(workingDirectory));
}

function promptNoConfig(workingDirectory: string) {
	stdout.write(`No valid config file found in ${workingDirectory}.\n Use [${CliFlagLong.init} | ${CliFlagShort.init}] flag to create config file\n`);
}
