export type CliFlag = "init" | "help" | "cli" | "json" | "noConfig" | "summary";
export interface LinterRuntimeArgs {
	workingDirectory: string;
	flags: Record<CliFlag, boolean>;
}

export enum CliFlagLong {
	init = "--init",
	help = "--help",
	cli = "--cli",
	summary = "--summary",
	json = "--json",
	noConfig = "--no-config",
}
export enum CliFlagShort {
	init = "-i",
	help = "-h",
	cli = "-c",
	summary = "-s",
	json = "-j",
	noConfig = "-n",
}
