import { argv, stdout } from "process";
import { getConfig } from "./config";
import { getConfigFromUser, writeConfigFile } from "./init";

function promptNoConfig() {
	return stdout.write("No config file found. Use --init flag to create config file\n");
}

async function main() {
	const config = await getConfig().catch(() => promptNoConfig());
	console.log(config);
}

async function init() {
	const config = await getConfig().then(() => {
		stdout.write("Config file already exists\n");
		return true;
	}
	).catch(() => getConfigFromUser());


	if (typeof config !== "boolean") {
		writeConfigFile(config).then(() => stdout.write("Config file has been created\n")
		);
	}

}

if (argv[2] === "--init") {
	init();
} else {
	main();
}
