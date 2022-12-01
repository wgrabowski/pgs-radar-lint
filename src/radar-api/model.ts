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

export interface RadarPackageEntry {
	name: string;
	status: PGSRadarStatus;
	packageName: string;
	replacementPackageName: string;
}
