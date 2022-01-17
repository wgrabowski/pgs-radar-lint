import { argv, cwd } from "process";
import { CliFlags, PGSRadarLinterRuntimeArgs } from "./model";

export function getResolvedArgs(): PGSRadarLinterRuntimeArgs {
	const rawOptions = argv.slice(2);
	return {
		workingDirectory: getWorkingDirectory(rawOptions),
		flags: {
			init: hasFlag(rawOptions, CliFlags.init),
			help: hasFlag(rawOptions, CliFlags.help)
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
	// TODO
	return "";
}