import { PGSRadarInfo } from "../api";

export const CONFIG_FILE_NAME = ".radarlintrc";

export interface PGSRadarLinterConfig {
	radars: PGSRadarInfo[];
}
