import { PGSRadarInfo } from "../radar-api/model";

export const CONFIG_FILE_NAME = "pgs-radar.json";

export interface PGSRadarLinterConfig {
	radars: PGSRadarInfo[];
}