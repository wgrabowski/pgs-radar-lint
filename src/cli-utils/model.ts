export interface PGSRadarLinterRuntimeArgs {
	workingDirectory: string;
	flags: {
		init: boolean;
		help: boolean;
		summary: boolean;
		json: boolean;
		allowHold: boolean;
	}
}

export enum CliFlags {
	init = "--init",
	help = "--help",
	summary = "--summary",
	json = "--json",
	allowHold = "--allowHold"
}
