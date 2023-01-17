import { API_URL } from "../config";

export const API_ENDPOINTS = {
	RADARS: () => `${API_URL}/radars`,
	FEATURES: () => `${API_URL}/radars/features`,
	RADAR: {
		PACKAGES: (radarId: string) => `${API_URL}/radars/${radarId}/packages`,
	},
};
