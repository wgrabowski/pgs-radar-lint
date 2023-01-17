import { argv, exit, stderr, stdout } from "process";
import { getRadars } from "../../api";
import { format, status } from "./status";
import { errorFormatter } from "../../errors";

const packageNames = argv.slice(2);

async function main() {
	const radars = await getRadars();
	const results = await status(radars, packageNames);

	stdout.write(format(results));
}

if (!packageNames.length) {
	stdout.write("Provide npm package names, separated by space\n");
	exit(0);
} else {
	main().catch((e) => {
		stderr.write(errorFormatter(e));
		exit(2);
	});
}
