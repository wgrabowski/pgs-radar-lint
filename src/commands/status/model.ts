import { Status } from "../../api";

export interface PackageStatus {
	packageName: string;
	statuses: Record<string, Status | null>;
}
