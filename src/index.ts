import { getLatestRadarEntries, getRadars } from "./radar-api";

async function main() {
	const radars = await getRadars();
	const entries = await getLatestRadarEntries(radars[0].spreadsheetId);

	console.table(entries);
}

main();