import { PGSRadarEntry, PGSRadarStatus } from "../radar-api/model";

export type PGSRadarLinterFormatter = (results: Record<PGSRadarStatus, PGSRadarEntry[]>) => string;