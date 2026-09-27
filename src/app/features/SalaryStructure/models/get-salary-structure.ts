import { SalaryStructure } from "./salary-structure";

export interface GetSalaryStructure extends SalaryStructure {
    id: string,
    status: string,
    structureTypeName: string,
    companyName: string,
    companyId: string
}
