import { StructureType } from "./sturcture-type";

export interface GetStructureType extends StructureType {
    id:string,
    status:string,
    companyName:string,
    companyId:string
}
