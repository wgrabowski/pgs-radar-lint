import { API_ENDPOINTS } from "./endpoints.js";
import { PGSRadarEntry, PGSRadarInfo } from "./model.js";
import fetch, { Response } from "node-fetch";

export async function getRadars(): Promise<PGSRadarInfo[]> {
	return fetch(API_ENDPOINTS.RADARS()).then(r => r.json()) as Promise<PGSRadarInfo[]>;
}

export async function getLatestRadarEntries(radarId: string): Promise<PGSRadarEntry[]> {
	return fetch(API_ENDPOINTS.RADAR.LATEST_BLIPS(radarId))
		.then(response => response.ok ? response.json() : createError(response))
		// .then(response => response.json())
		.then(entries => {
			// console.log(JSON.stringify(entries));
			return (entries as PGSRadarEntry[]).map(entry => (
				{
					...entry,
					npmPackageName: entry.name.toLowerCase() // TODO this is mock
				} as PGSRadarEntry
			));
		});
}

function createError(response: Response) {
	return new Promise((resolve, reject) => {
		response.json().then((result: any) => result?.message ? reject(result.message) : reject(result));
	});
}