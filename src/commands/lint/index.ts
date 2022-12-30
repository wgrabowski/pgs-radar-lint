import { exit } from "process";

import { lint } from "./lint";
import { init } from "./init";
import { CliFlag, getResolvedArgs, printHelp } from "../../cli";
import { defaultFormatter, jsonFormatter, summaryFormatter } from "./format";


const {flags, workingDirectory} = getResolvedArgs();

function getFormatter(flags: Record<CliFlag, boolean>) {
	if (flags.json) {
		return jsonFormatter;
	}
	if (flags.summary) {
		return summaryFormatter;
	}
	return defaultFormatter;
}

if (flags.help) {
	printHelp();
	exit(0);
} else if (flags.init) {
	init(workingDirectory);
} else {
	lint(workingDirectory, getFormatter(flags));
}
