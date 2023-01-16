import { API_ENDPOINTS } from "./endpoints";
import {
	RadarPackageEntry,
	PGSRadarInfo,
	RadarFeatures,
	NPM_FEATURE_FLAG_NAME,
} from "./model";
import fetch, { Response } from "node-fetch-native";
import { ApiError } from "../commands/lint/errors";

export async function getRadars(): Promise<PGSRadarInfo[]> {
	return Promise.all([getFeatures(), getAllRadars()])
		.then(([features, radars]) => {
			const namesOfRadarsWithNpmPackages = features
				.filter((entry) => {
					return entry.featureFlags.some(
						({ name, enabled }) => name === NPM_FEATURE_FLAG_NAME && enabled
					);
				})
				.map(({ radarName }) => radarName);

			return radars.filter(({ title }) =>
				namesOfRadarsWithNpmPackages.includes(title)
			);
		})
		.catch(() => {
			throw new ApiError();
		});
}

async function getAllRadars(): Promise<PGSRadarInfo[]> {
	return fetch(API_ENDPOINTS.RADARS())
		.then((r) => r.json())
		.catch(() => {
			throw new ApiError();
		}) as Promise<PGSRadarInfo[]>;
}

async function getFeatures(): Promise<RadarFeatures[]> {
	return fetch(API_ENDPOINTS.FEATURES())
		.then((r) => r.json())
		.catch(() => {
			throw new ApiError();
		}) as Promise<RadarFeatures[]>;
}

export async function getPackages(
	radarId: string
): Promise<RadarPackageEntry[]> {
	return fetch(API_ENDPOINTS.RADAR.PACKAGES(radarId))
		.then((response) => (response.ok ? response.json() : createError(response)))
		.then((entries) => {
			return (entries as Array<any>).map((entry) => ({
				...entry,
				status: entry.status.name,
			})) as RadarPackageEntry[];
		})
		.catch(() => {
			throw new ApiError();
		});
}

function createError(response: Response) {
	return new Promise((resolve, reject) => {
		response
			.json()
			.then((result: any) =>
				result?.message ? reject(result.message) : reject(result)
			);
	});
}
