# PGS Radar Lint
lint your package.json against PGS Software Technology Radar
> this is POC version, not published in any npm repository


## pgs-radar-lint
`pgs-radar-lint` lints package.json against  PGS Technology Radar (https://radar.pgs-soft.com)

```
pgs-radar-lint - lint your package.json against PGS Software Technology Radar

Usage: pgs-radar-lint <directory>

Options:
        <directory>  - location of package.json (optional) - current directory is default
        --init       - creates config file in <directory> (interactive)
        --help       - shows this help

Output formatting:
                     - default format (dependencies in Hold status)
        --summary    - print dependencies from all statuses
        --json       - print output in raw JSON


Visit  (https://radar.pgs-soft.com) to see PGS Technology Radar
```

## pgs-radar-status

`pgs-radar-status` prints status of provided npm packages list from all PGS Technology radars

# local testing
Run `npm install && npm build && npm link` for testing binaries on local machine

