import { getPackages, RadarPackageEntry, Status } from "../../api";

export type LinterResults = Record<Status, RadarPackageEntry[]> & {
	dependencies:{
        all:string[],
        inRadar:string[],
        notInRadar:string[]
    },
    radarNames:string[]
}