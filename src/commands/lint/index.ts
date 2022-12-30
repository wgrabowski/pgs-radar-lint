import { exit, stderr } from "process";

import { lint } from "./lint";
import { init } from "./init";
import { CliFlag, getResolvedArgs, printHelp } from "../../cli";
import { defaultFormatter, jsonFormatter, summaryFormatter } from "./format";
import { isConfigIncompatible } from "../../config";


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

async function main() {
	if (flags.help) {
		printHelp();
		exit(0);
	} else if (flags.init) {
		init(workingDirectory);
	} else {
		// TODO add better error handling and message formatting
		const configIncompatible = await isConfigIncompatible(workingDirectory);
		if(configIncompatible) {
			stderr.write(`Config file found in ${workingDirectory} might contain references to radars that are no longer available.\n
			 \rPlease call pgs-radar-lint --init to create new config\n`);
			exit(2);
		}

		lint(workingDirectory, getFormatter(flags));
	}
}

main();
