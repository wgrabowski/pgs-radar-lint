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

export interface PGSRadarBlip {
	name: string,
	section: string,
	status: PGSRadarStatus,
	previousStatus: PGSRadarStatus | null,
	state: string
	npmPackageName: string;
}

export interface PGSRadarEntry {
	name: string;
	status: PGSRadarStatus;
	npmPackageName: string;
}
