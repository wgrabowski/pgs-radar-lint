export type CliFlag = "init" | "help" | "ci" | "json" | "noConfig" | "summary";

export interface LinterRuntimeArgs {
	workingDirectory: string;
	flags: Record<CliFlag, boolean>;
}

export enum CliFlagLong {
	init = "--init",
	help = "--help",
	ci = "--ci",
	summary = "--summary",
	json = "--json",
	noConfig = "--no-config",
}

export enum CliFlagShort {
	init = "-i",
	help = "-h",
	ci = "-c",
	summary = "-s",
	json = "-j",
	noConfig = "-n",
}
