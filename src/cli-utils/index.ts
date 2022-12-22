import { argv, cwd } from "process";
import { CliFlags, PGSRadarLinterRuntimeArgs } from "./model.js";
import { CONFIG_FILE_NAME } from "../config/model.js";

export function getResolvedArgs(): PGSRadarLinterRuntimeArgs {
	const rawOptions = argv.slice(2);
	return {
		workingDirectory: getWorkingDirectory(rawOptions),
		flags: {
			init: hasFlag(rawOptions, CliFlags.init),
			summary: hasFlag(rawOptions, CliFlags.summary),
			help: hasFlag(rawOptions, CliFlags.help),
			json: hasFlag(rawOptions, CliFlags.json),
			allowHold: hasFlag(rawOptions, CliFlags.allowHold)
		}
	};
}

function getWorkingDirectory(rawOptions: string[]): string {
	return rawOptions.filter(option => !option.startsWith("--"))[0] || cwd();
}

function hasFlag(rawOptions: string[], flag: CliFlags): boolean {
	return rawOptions.includes(flag);
}

export function getHelp(): string {
	let output = "pgs-radar-lint - lint dependencies from your package.json against PGS Software Technology Radar\n";
	output += "\nUsage: pgs-radar-lint <directory>\n";

	output += "\nOptions:\n";
	output += `\t${"<directory>".padEnd(getOptionPadding())} - directory with package.json - (optional) current directory is default\n`;
	output += `\t${CliFlags.init.padEnd(getOptionPadding())} - creates config file (${CONFIG_FILE_NAME}) in <directory> (interactive)\n`;
	output += `\t${CliFlags.help.padEnd(getOptionPadding())} - shows this help\n`;

	output += "\nOutput formatting:\n";
	output += `\t${"".padEnd(getOptionPadding())} - default format (dependencies in Hold status)\n`;
	output += `\t${CliFlags.summary.padEnd(getOptionPadding())} - print dependencies from all statuses\n`;
	output += `\t${CliFlags.json.padEnd(getOptionPadding())} - print output in raw JSON\n`;

	output += `\t${CliFlags.allowHold.padEnd(getOptionPadding())} - ignore found dependencies in Hold status (exit with success code)\n`;

	output += "\n\nVisit  (https://radar.pgs-soft.com) to see PGS Technology Radar\n";
	return output;
}

function getOptionPadding(): number {
	return Math.max("<directory>".length, ...Object.values(CliFlags).map(value => value.length)) + 1;
}
