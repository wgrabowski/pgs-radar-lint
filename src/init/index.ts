/* eslint-disable @typescript-eslint/ban-ts-comment */
import { prompt } from "enquirer";
import { PGSRadarLinterConfig } from "../config/model";
import { getRadars } from "../radar-api";
import { PGSRadarInfo } from "../radar-api/model";
import { writeFile } from "fs";
import { getConfigFilePath } from "../config";

export async function getConfigFromUser(): Promise<PGSRadarLinterConfig> {
	const radarsList = await getRadars()
		.then(radars => radars.map(radarToChoice));

	return await prompt({
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

export async function writeConfigFile(config: PGSRadarLinterConfig): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			writeFile(getConfigFilePath(), JSON.stringify(config,null,2), {encoding: "utf-8"}, () => resolve(getConfigFilePath()));
		} catch (e) {
			reject(e);
		}
	});
}

function radarToChoice({title, spreadsheetId}: PGSRadarInfo) {
	return {
		name: title,
		value: spreadsheetId
	};
}

