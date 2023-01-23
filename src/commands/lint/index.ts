import { exit, stderr, stdout } from "process";

import { lint } from "./lint";
import { init } from "./init";
import { CliFlag, getResolvedArgs, printHelp } from "../../cli";
import { defaultFormatter, jsonFormatter, summaryFormatter } from "./format";
import { errorFormatter } from "../../errors";
import { checkConfig, hasPackageJson } from "./config";

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
		const configOk = await checkConfig(workingDirectory);

		if (!configOk) {
			exit(2);
		}

		if (!hasPackageJson(workingDirectory)) {
			stdout.write(
				`No package.json file found in specified directory (${workingDirectory}).\nMake sure that you call xebia-radar-lint in the right directory.\n`
			);
			return;
		}

		await lint(workingDirectory, getFormatter(flags));
	}
}

main().catch((e) => {
	stderr.write(errorFormatter(e));
	exit(2);
});
