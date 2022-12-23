import { CONFIG_FILE_NAME, PGSRadarLinterConfig } from "./model.js";
import { readFile,existsSync } from "fs";
import { join } from "path";

export function getConfigFilePath(workingDirectory: string): string {
	return join(workingDirectory, CONFIG_FILE_NAME);
}

export function getConfig(workingDirectory: string): Promise<PGSRadarLinterConfig> {
	return new Promise((resolve, reject) => {
		readFile(getConfigFilePath(workingDirectory), {encoding: "utf-8"}, (err, data) => {
			if (err) {
				reject(err.message);
			} else {
				try{
					resolve(JSON.parse(data));
				} catch (e) {
					reject("Invalid config file");
				}
			}
		});
	});
}

export function checkIfConfigExists(workingDirectory: string): boolean {
	return existsSync(getConfigFilePath(workingDirectory));
}
