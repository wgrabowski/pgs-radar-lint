export interface PGSRadarInfo {
	title: string,
	spreadsheetId: string;
}

export const enum PGSRadarStatus {
	Adopt = "Adopt",
	Trial = "Trial",
	Assess = "Assess",
	Hold = "Hold"
}

export interface PGSRadarEntry {
	name: string,
	section: string,
	status: PGSRadarStatus,
	previousStatus: PGSRadarStatus | null,
	state: string // TODO maybe add enum
	npmPackageName: string;
}