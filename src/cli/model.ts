export type CliFlag = "init" | "help" | "summary" | "json" | "noConfig";
export interface LinterRuntimeArgs {
	workingDirectory: string;
	flags: Record<CliFlag, boolean>;
}

export enum CliFlagLong {
	init = "--init",
	help = "--help",
	summary = "--summary",
	json = "--json",
	noConfig = "--no-config",
}
export enum CliFlagShort {
	init = "-i",
	help = "-h",
	summary = "-s",
	json = "-j",
	noConfig = "-n",
}
