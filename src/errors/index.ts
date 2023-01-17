import { getErrorTitle } from "../cli";

export class IncompatibleConfigError extends Error {
	public name = "Incompatible config";
	public message =
		"Your config file contains entries that are not available in current API.\nCall pgs-radar-lint --init to create new config";
}

export class InvalidConfigError extends Error {
	public name = "Invalid config file";
	public message =
		"Your config file is invalid and cannot be parsed.\nCall pgs-radar-lint --init to create new config";
}

export class ApiError extends Error {
	public name = "API error";
	public message = "Error while fetching from API";
}

export function errorFormatter(error: Error | string): string {
	if (typeof error !== "string") {
		return `\n${getErrorTitle(error.name)}\n${error.message}\n`;
	}

	return `\n${getErrorTitle(error)}\n`;
}
