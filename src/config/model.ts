import { PGSRadarInfo } from "../radar-api/model";

export const CONFIG_FILE_NAME = ".radarlintrc";

export interface PGSRadarLinterConfig {
	radars: PGSRadarInfo[];
}
