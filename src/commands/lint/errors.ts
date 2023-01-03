import { getErrorTitle } from "../../cli";

export class IncompatibleConfigError extends Error {
	public name = "incompatible config";
	public message = "Your config file contains entries that are not available in current API.\nCall pgs-radar-lint --init to create new config";
}
export class InvalidConfigError extends Error {
	public name = "invalid config file";
	public message = "Your config file is invalid and cannot be parsed.\nCall pgs-radar-lint --init to create new config";
}

export function errorFormatter(error: Error): string {
	return `\n${getErrorTitle(error.name)}\n${error.message}\n`;
}

