import { exit, stderr } from 'process';

import { lint } from './lint';
import { init } from './init';
import { CliFlag, getResolvedArgs, printHelp } from '../../cli';
import { defaultFormatter, jsonFormatter, summaryFormatter } from './format';
import { isConfigIncompatible } from '../../config';
import { errorFormatter, IncompatibleConfigError } from './errors';

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
		init(workingDirectory);
	} else {
		// TODO add better error handling and message formatting
		const configIncompatible = await isConfigIncompatible(workingDirectory);
		if (configIncompatible) {
			throw new IncompatibleConfigError();
		}

		lint(workingDirectory, getFormatter(flags));
	}
}

main().catch((e) => {
	stderr.write(errorFormatter(e));
	exit(2);
});
