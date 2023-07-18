export interface Radar {
	title: string;
	spreadsheetId: string;
}

export const enum Status {
	Adopt = "Adopt",
	Trial = "Trial",
	Assess = "Assess",
	Hold = "Hold"
}

export interface RadarPackageEntry {
	name: string;
	status: Status;
	packageName: string;
	replacementPackageName: string;
}

export interface FeatureFlag {
	name: string;
	enabled: boolean;
}

export interface RadarFeatures {
	radarName: string;
	featureFlags: FeatureFlag[];
}
