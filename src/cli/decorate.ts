import * as colors from "ansi-colors";
import { Status } from "../api";

const { blue, green, red, yellow } = colors;

const StatusColor: Record<Status, colors.StyleFunction> = {
	[Status.Hold]: red.bold,
	[Status.Assess]: yellow.bold,
	[Status.Trial]: blue.bold,
	[Status.Adopt]: green.bold,
};

export function getDecoratedStatusName(status: Status): string {
	return StatusColor[status](status);
}

export function getErrorTitle(text: string): string {
	return `${red(text)}`;
}
