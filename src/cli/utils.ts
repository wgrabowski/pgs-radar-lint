import { argv, cwd, stdout } from "process";
import { CliFlagLong, CliFlagShort, LinterRuntimeArgs } from "./model";
import { CONFIG_FILE_NAME, LINT_EXECUTABLE_NAME } from "../config";

export function getResolvedArgs(): LinterRuntimeArgs {
	const rawOptions = argv.slice(2);
	return {
		workingDirectory: getWorkingDirectory(rawOptions),
		flags: {
			init: hasFlag(rawOptions, CliFlagLong.init, CliFlagShort.init),
			summary: hasFlag(rawOptions, CliFlagLong.summary, CliFlagShort.summary),
			help: hasFlag(rawOptions, CliFlagLong.help, CliFlagShort.help),
			json: hasFlag(rawOptions, CliFlagLong.json, CliFlagShort.json),
		},
	};
}

function getWorkingDirectory(rawOptions: string[]): string {
	return rawOptions.filter((option) => !option.startsWith("-"))[0] || cwd();
}

function hasFlag(
	rawOptions: string[],
	longFlag: CliFlagLong,
	shortFlag: CliFlagShort
): boolean {
	return rawOptions.includes(longFlag) || rawOptions.includes(shortFlag);
}

export function printHelp() {
	stdout.write(getHelp());
}

export function getHelp(): string {
	let output = `${LINT_EXECUTABLE_NAME} - lint dependencies from your package.json against Xebia Technology Radar\n`;
	output += "\nUsage: ${LINT_EXECUTABLE_NAME} <directory>\n";

	output += "\nOptions:\n";
	output += `\t${"<directory>".padEnd(
		getOptionPadding()
	)} - directory with package.json and ${CONFIG_FILE_NAME} files - (optional) current directory is default\n`;
	output += `\t${CliFlagShort.init}, ${CliFlagLong.init.padEnd(
		getOptionPadding()
	)} - creates config file (${CONFIG_FILE_NAME}) in <directory> (interactive)\n`;
	output += `\t${CliFlagShort.help}, ${CliFlagLong.help.padEnd(
		getOptionPadding()
	)} - shows this help\n`;

	output += "\nOutput formatting:\n";
	output += `\t    ${"".padEnd(
		getOptionPadding()
	)} - default format (dependencies in Hold status)\n`;
	output += `\t${CliFlagShort.summary}, ${CliFlagLong.summary.padEnd(
		getOptionPadding()
	)} - print dependencies from all statuses\n`;
	output += `\t${CliFlagShort.json}, ${CliFlagLong.json.padEnd(
		getOptionPadding()
	)} - print output in raw JSON\n`;

	output +=
		"\n\nVisit  (https://radar.xebia-soft.com) to see Xebia Technology Radar\n";
	return output;
}

function getOptionPadding(): number {
	return (
		Math.max(
			"<directory>".length,
			...Object.values(CliFlagLong).map((value) => value.length)
		) +
		1 +
		4
	);
}
