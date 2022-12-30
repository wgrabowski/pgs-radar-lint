# PGS Radar Lint
lint your package.json against PGS Software Technology Radar
> this is POC version, not published in any npm repository


## pgs-radar-lint
`pgs-radar-lint` lints package.json against  PGS Technology Radar (https://radar.pgs-soft.com)

```
pgs-radar-lint - lint dependencies from your package.json against PGS Software Technology Radar

Usage: pgs-radar-lint <directory>

Options:
        <directory>      - directory with package.json - (optional) current directory is default
        -i, --init           - creates config file (.radarlintrc) in <directory> (interactive)
        -h, --help           - shows this help

Output formatting:
                             - default format (dependencies in Hold status)
        -s, --summary        - print dependencies from all statuses
        -j, --json           - print output in raw JSON


Visit  (https://radar.pgs-soft.com) to see PGS Technology Radar
```
## pgs-radar-status

`pgs-radar-status` prints status of provided npm packages list from all PGS Technology radars

## Exit codes
`pgs-radar-lint` exit codes:
 - `1` dependencies in `Hold` status found
 - `2` an error occured
 - `0` success and any other scenario
# local testing
Use  `npm link` for local testing. See docs [here](https://docs.npmjs.com/cli/v9/commands/npm-link)

For development use `npm start`, which will first link package locally and then watch for changes in code and rebuild code.

