import { stdout } from "process";
import { getConfig } from "./config";
import { PGSRadarLinterConfig } from "./config/model";
import { defaultFormatter, summaryFormatter } from "./format";
import { getConfigFromUser, writeConfigFile } from "./init";
import { lint } from "./lint";
import { getHelp, getResolvedArgs } from "./cli-utils";
import { PGSRadarLinterFormatter } from "./format/model";
import { CliFlags } from "./cli-utils/model";


const {flags, workingDirectory} = getResolvedArgs();

function promptNoConfig() {
	return stdout.write(`No config file found. Use ${CliFlags.init} flag to create config file\n`);
}

async function main(workingDirectory: string, formatter: PGSRadarLinterFormatter = defaultFormatter) {
	const config = await getConfig(workingDirectory).catch(() => promptNoConfig());
	try {
		const result = await lint(workingDirectory, config as PGSRadarLinterConfig);

		stdout.write(formatter(result));
		stdout.write("\n");
	} catch (e) {//
	}
}

// TODO move to separate binary, to reduce package size
async function init(workingDirectory: string) {
	const config = await getConfig(workingDirectory).then(() => {
		stdout.write("Config file already exists\n");
		return true;
	}
	).catch(() => getConfigFromUser());


	if (typeof config !== "boolean") {
		writeConfigFile(config, workingDirectory).then((configFilePath) => stdout.write(`Config file has been created in ${configFilePath}\n`)
		);
	}
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
} else {
	main(workingDirectory, defaultFormatter);
}