import { IncomingMessage } from "http";
import { get } from "https";

// TODO node-fetch has problem working with TS
export async function fetchData<T>(url: string) {
	return new Promise<T>((resolve, reject) => {
		get(url, response => onResponse<T>(response, resolve, reject));
	});
}

function onResponse<T>(response: IncomingMessage, resolve: (value: T) => void, reject: (value: unknown) => void) {
	const error = !response.statusCode || response.statusCode >= 400;
	let responseBody = "";

	if (error) {
		reject(`Request to ${response.url} failed with HTTP ${response.statusCode}`);
	}
	response.on("data", chunk => responseBody += chunk.toString());

	// once all the data has been read, resolve the Promise
	response.on("end", () => resolve(JSON.parse(responseBody) as T));
}