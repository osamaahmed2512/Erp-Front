import { SalaryRuleCategory } from "./salary-rule-category";

export interface GetSalaryRuleCategory extends SalaryRuleCategory {
    id: string,
    status: string,
    companyName: string,
    companyId: string
}
