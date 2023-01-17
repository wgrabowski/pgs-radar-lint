import { exit, stderr } from "process";

import { lint } from "./lint";
import { init } from "./init";
import { CliFlag, getResolvedArgs, printHelp } from "../../cli";
import { defaultFormatter, jsonFormatter, summaryFormatter } from "./format";
import { checkConfig } from "../../config";
import { errorFormatter } from "../../errors";

const { flags, workingDirectory } = getResolvedArgs();

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
		await init(workingDirectory);
	} else {
		await checkConfig(workingDirectory);
		await lint(workingDirectory, getFormatter(flags));
	}
}

main().catch((e) => {
	stderr.write(errorFormatter(e));
	exit(2);
});
