export type CliFlag = 'init' | 'help' | 'summary' | 'json';
export interface PGSRadarLinterRuntimeArgs {
	workingDirectory: string;
	flags: Record<CliFlag, boolean>;
}

export enum CliFlagLong {
	init = '--init',
	help = '--help',
	summary = '--summary',
	json = '--json',
}
export enum CliFlagShort {
	init = '-i',
	help = '-h',
	summary = '-s',
	json = '-j',
}
