import { fetchData } from "../fetch-data";
import { API_ENDPOINTS } from "./endpoints";
import { PGSRadarEntry, PGSRadarInfo } from "./model";

export async function getRadars(): Promise<PGSRadarInfo[]> {
	return fetchData<PGSRadarInfo[]>(API_ENDPOINTS.RADARS());
}

export async function getLatestRadarEntries(radarId: string): Promise<PGSRadarEntry[]> {
	return fetchData<PGSRadarEntry[]>(API_ENDPOINTS.RADAR.LATEST_BLIPS(radarId))
		.then(entries => entries.map(entry => (
					{
						...entry,
						npmPackageName: entry.name.toLowerCase() // TODO this is mock
					} as PGSRadarEntry
		)
		)
		);
}
