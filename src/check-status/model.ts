import { PGSRadarStatus } from "../api";

export interface PGSRadarPackageStatus {
	packageName: string;
	statuses: Record<string, PGSRadarStatus | null>
}
