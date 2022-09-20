import { API_ENDPOINTS } from "./endpoints.js";
import { PGSRadarBlip, PGSRadarEntry, PGSRadarInfo } from "./model.js";
import fetch, { Response } from "node-fetch";

export async function getRadars(): Promise<PGSRadarInfo[]> {
	return fetch(API_ENDPOINTS.RADARS()).then(r => r.json()) as Promise<PGSRadarInfo[]>;
}

export async function getLatestRadarEntries(radarId: string): Promise<PGSRadarEntry[]> {
	return fetch(API_ENDPOINTS.RADAR.LATEST_BLIPS(radarId))
		.then(response => response.ok ? response.json() : createError(response))
		.then(entries => {
			return (entries as PGSRadarBlip[]).map(({name, status, npmPackageName}) => (
				{
					name,
					status,
					npmPackageName: npmPackageName || name.toLowerCase() // TODO this is mock
				} as PGSRadarEntry
			));
		});8;
}

function createError(response: Response) {
	return new Promise((resolve, reject) => {
		response.json().then((result: any) => result?.message ? reject(result.message) : reject(result));
	});
}