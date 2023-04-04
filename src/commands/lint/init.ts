import { exit, stdout } from "process";
import { getRadars, Radar } from "../../api";

import { writeFile } from "fs";
import { doesConfigExists, getConfigFilePath, LinterConfig } from "./config";
import enquirer = require("enquirer");

export async function init(workingDirectory: string) {
	const configExists = doesConfigExists(workingDirectory);
	let overwrite;

	if (configExists) {
		overwrite = await askToOverwriteConfigFile(workingDirectory);
	}

	if (overwrite === false) {
		return;
	}

	const config = await getConfigFromUser();
	writeConfigFile(config as LinterConfig, workingDirectory).then(
		(configFilePath) =>
			stdout.write(`Config file has been created in ${configFilePath}\n`)
	);
}

export async function getConfigFromUser(): Promise<LinterConfig> {
	const radarsList = await getRadars().then((radars) =>
		radars.map(radarToChoice)
	);

	if (radarsList.length === 0) {
		stdout.write("Currently API returns no radars to choose from.\n");
		exit(0);
	}

	return await enquirer.prompt({
		name: "radars",
		message:
			"Which radars(s) you want use to check your dependencies?\n(press space to select, move with arrows)",
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
			return (names as string[]).map((name) => ({
				title: name,
				spreadsheetId: mappedResult[name],
			})) as unknown as string;
		},
	});
}

async function writeConfigFile(
	config: LinterConfig,
	workingDirectory: string
): Promise<string> {
	const configFilePath = getConfigFilePath(workingDirectory);

	return new Promise((resolve, reject) => {
		try {
			writeFile(
				configFilePath,
				JSON.stringify(config, null, 2),
				{ encoding: "utf-8" },
				() => resolve(configFilePath)
			);
		} catch (e) {
			reject(e);
		}
	});
}

async function askToOverwriteConfigFile(
	workingDirectory: string
): Promise<boolean> {
	return await enquirer
		.prompt<{ overwrite: boolean }>({
			name: "overwrite",
			type: "confirm",
			message: `Config file exists in ${workingDirectory}. Overwrite it?`,
			initial: false,
		})
		.then(({ overwrite }) => overwrite);
}

function radarToChoice({ title, spreadsheetId }: Radar) {
	return {
		name: title,
		value: spreadsheetId,
	};
}
