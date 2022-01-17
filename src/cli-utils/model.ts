export interface PGSRadarLinterRuntimeArgs {
	workingDirectory: string;
	flags: {
		init: boolean;
		help: boolean;
	}
}

export enum CliFlags {
	init = "--init",
	help = "--help"
}