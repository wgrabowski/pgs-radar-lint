/* eslint-disable @typescript-eslint/ban-ts-comment */
import enquirer from "enquirer";
import { PGSRadarLinterConfig } from "../config/model.js";
import { getRadars } from "../radar-api/index.js";
import { PGSRadarInfo } from "../radar-api/model.js";
import { writeFile } from "fs";
import { getConfigFilePath } from "../config/index.js";

export async function getConfigFromUser(): Promise<PGSRadarLinterConfig> {
	const radarsList = await getRadars()
		.then(radars => radars.map(radarToChoice));

	return await enquirer.prompt({
		name: "radars",
		message: "Which PGS Tech radar(s) you want use to check your dependencies?",
		choices: radarsList,
		type: "multiselect",
		required: true,
		result(names) {
			// Typescript definitions for enquirer are not complete
			// @ts-ignore
			const mappedResult = this.map(names);
			// @ts-ignore
			// Typescript definitions for enquirer are not complete
			return (names as string[]).map(name => ({title: name, spreadsheetId: mappedResult[name]})) as unknown as string;
		}
	});
}

export async function writeConfigFile(config: PGSRadarLinterConfig, workingDirectory: string): Promise<string> {
	const configFilePath = getConfigFilePath(workingDirectory);

	return new Promise((resolve, reject) => {
		try {
			writeFile(configFilePath, JSON.stringify(config, null, 2), {encoding: "utf-8"}, () => resolve(configFilePath));
		} catch (e) {
			reject(e);
		}
	});
}

export async function askToOverwriteConfigFile(workingDirectory: string): Promise<boolean> {
	return await enquirer.prompt<{overwrite:boolean}>( {
		name: "overwrite",
		type: "confirm",
		message: `Config file exists in ${workingDirectory}. Overwrite it?`,
		initial: false
	}).then(({overwrite})=>overwrite);
}

function radarToChoice({title, spreadsheetId}: PGSRadarInfo) {
	return {
		name: title,
		value: spreadsheetId
	};
}

