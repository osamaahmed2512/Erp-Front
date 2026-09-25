import { WorkEntyDto } from "./work-enty-dto";

export interface GetWorkEnrtyDto extends WorkEntyDto {
 companyId:string,
 companyName:string,
 status:string,
 id:string
}
