import { checkIfConfigExists, getConfigFilePath } from "../../config";
import { PGSRadarLinterConfig } from "../../config/model";
import { stdout } from "process";
import { getRadars, PGSRadarInfo } from "../../api";
import enquirer from "enquirer";
import { writeFile } from "fs";

export async function init(workingDirectory: string) {
	const configExists = checkIfConfigExists(workingDirectory);
	let overwrite;

	if (configExists) {
		overwrite = await askToOverwriteConfigFile(workingDirectory);
	}

	if (overwrite === false) {
		return;
	}

	const config = await getConfigFromUser();
	writeConfigFile(config as PGSRadarLinterConfig, workingDirectory)
		.then((configFilePath) => stdout.write(`Config file has been created in ${configFilePath}\n`));
}

async function getConfigFromUser(): Promise<PGSRadarLinterConfig> {
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
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const mappedResult = this.map(names);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// Typescript definitions for enquirer are not complete
			return (names as string[]).map(name => ({title: name, spreadsheetId: mappedResult[name]})) as unknown as string;
		}
	});
}

async function writeConfigFile(config: PGSRadarLinterConfig, workingDirectory: string): Promise<string> {
	const configFilePath = getConfigFilePath(workingDirectory);

	return new Promise((resolve, reject) => {
		try {
			writeFile(configFilePath, JSON.stringify(config, null, 2), {encoding: "utf-8"}, () => resolve(configFilePath));
		} catch (e) {
			reject(e);
		}
	});
}

async function askToOverwriteConfigFile(workingDirectory: string): Promise<boolean> {
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
