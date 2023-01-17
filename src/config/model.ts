import { Radar } from "../api";

export const CONFIG_FILE_NAME = ".radarlintrc";

export interface LinterConfig {
	radars: Radar[];
}
