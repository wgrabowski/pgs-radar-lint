# Xebia Radar Lint

lint your package.json against [Xebia Technology Radar](https://radar.xebia.com)

## xebia-radar-lint

```
xebia-radar-lint - lint dependencies from your package.json against Xebia Technology Radar

Usage: xebia-radar-lint <directory>

Options:
	<directory>      - directory with package.json and .radarlintrc files - (optional) current directory is default
	-i, --init           - creates config file (.radarlintrc) in <directory> (interactive)
	-n, --no-config      - prompt user for config, doesn't require config file  and ignores it if it exists (interactive)
	-h, --help           - shows this help

Output formatting:
	                     - default format (dependencies in Hold status)
	-c, --cli            - dependencies in Hold status
	-s, --summary        - detailed summary format
	-j, --json           - print output in raw JSON


Visit  (https://radar.xebia.com) to see Xebia Technology Radar

```

### With config file:

Config file needs to be created:

`xebia-radar-lint --init` - create config file (`.radarlintrc`) in current directory

`xebia-radar-lint --init <directory>` - create config file (`.radarlintrc`) in `<directory>`

When file exists run `xebia-radar-lint` with optional flags

### Without config file:

`xebia-radar-lint --no-config` - run linter without config file, you will be asked each time which radars use to check
you `package.json`

## xebia-radar-status

`xebia-radar-status` prints status of provided npm packages list from all Xebia Technology radars

## Exit codes

`xebia-radar-lint` exit codes:

- `1` dependencies in `Hold` status found
- `2` an error occurred
- `0` success and any other scenario

# local testing

Use  `npm link` for local testing. See docs [here](https://docs.npmjs.com/cli/v9/commands/npm-link)

For development use `npm start`, which will first link package locally and then watch for changes in code and rebuild
code.

