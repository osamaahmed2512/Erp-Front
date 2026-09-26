import { SalaryRuleCategory } from "./salary-rule-category";

export interface CreateSalaryRuleCategory extends SalaryRuleCategory {
    companyId: string
}
