const PGS_RADAR_API_URL = "https://radar.pgs-soft.com/api/";
export const API_ENDPOINTS = {
	RADARS: () => `${PGS_RADAR_API_URL}/radars/examples`,
	RADAR: {
		LATEST_BLIPS: (radarId: string) => `${PGS_RADAR_API_URL}/radars/${radarId}/blips`
	}
};
