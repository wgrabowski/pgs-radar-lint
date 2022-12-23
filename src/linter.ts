import { stderr, stdout } from "process";
import { checkIfConfigExists, getConfig } from "./config/index.js";
import { PGSRadarLinterConfig } from "./config/model.js";
import { defaultFormatter, jsonFormatter, summaryFormatter } from "./format/index.js";
import { askToOverwriteConfigFile, getConfigFromUser, writeConfigFile } from "./init/index.js";
import { lint } from "./lint/index.js";
import { getHelp, getResolvedArgs } from "./cli-utils/index.js";
import { PGSRadarLinterFormatter } from "./format/model.js";
import { CliFlags } from "./cli-utils/model.js";


const {flags, workingDirectory} = getResolvedArgs();

function promptNoConfig(workingDirectory: string) {
	stdout.write(`No valid config file found in ${workingDirectory}.\n Use ${CliFlags.init} flag to create config file\n`);
}

async function main(workingDirectory: string, formatter: PGSRadarLinterFormatter = defaultFormatter) {
	const config = await getConfig(workingDirectory).catch(() => promptNoConfig(workingDirectory));

	if (!config) {
		return;
	}

	try {
		const result = await lint(workingDirectory, config as PGSRadarLinterConfig);

		stdout.write(formatter(result));
		stdout.write("\n");
		process.exit((result.Hold.length && !flags.allowHold) > 0 ? 1 : 0);
	} catch (e) {
		// TODO add custom formatter for errors
		stderr.write(`\npgs-radar-lint error: ${JSON.stringify(e, null, 2)}\n`);
		process.exit(2);
	}
}

// TODO move to separate binary, to reduce package size
// TODO allow overwriting existing config
async function init(workingDirectory: string) {
	const configExists = checkIfConfigExists(workingDirectory);
	let overwrite;

	if (configExists) {
		overwrite = await askToOverwriteConfigFile(workingDirectory);
	}

	if (overwrite === false) {
		return;
	}

	const config = await getConfigFromUser();
	writeConfigFile(config as PGSRadarLinterConfig, workingDirectory)
		.then((configFilePath) => stdout.write(`Config file has been created in ${configFilePath}\n`));
}

function help() {
	stdout.write(getHelp());
}



if (flags.help) {
	help();
} else if (flags.init) {
	init(workingDirectory);
} else if (flags.summary) {
	main(workingDirectory, summaryFormatter);
} else if (flags.json) {
	main(workingDirectory, jsonFormatter);
} else {
	main(workingDirectory, defaultFormatter);
}
