import { CONFIG_FILE_NAME, PGSRadarLinterConfig } from "./model";
import { readFile } from "fs";
import { cwd } from "process";
import { join } from "path";

export function getConfigFilePath(): string {
	return join(cwd(), CONFIG_FILE_NAME);
}

export function getConfig(): Promise<PGSRadarLinterConfig> {
	return new Promise((resolve, reject) => {
		readFile(getConfigFilePath(), {encoding: "utf-8"}, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}