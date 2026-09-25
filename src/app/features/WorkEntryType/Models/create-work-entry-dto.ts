import { UpdateWorkEntryDto } from "./update-work-entry-dto";
import { WorkEntyDto } from "./work-enty-dto";

export interface CreateWorkEntryDto extends WorkEntyDto {
  companyId: string
}
