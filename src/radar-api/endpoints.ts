// const PGS_RADAR_API_URL = "https://radar.pgs-soft.com/api/";
const PGS_RADAR_API_URL = "http://localhost:3000";
export const API_ENDPOINTS = {
	RADARS: () => `${PGS_RADAR_API_URL}/radars`,
	RADAR: {
		LATEST_BLIPS: (radarId: string) => `${PGS_RADAR_API_URL}/radars/${radarId}`
	}
};
