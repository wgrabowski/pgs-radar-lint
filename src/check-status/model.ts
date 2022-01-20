import { PGSRadarStatus } from "../radar-api/model";

export interface PGSRadarPackageStatus {
	packageName: string;
	statuses: Record<string, PGSRadarStatus | null>
}