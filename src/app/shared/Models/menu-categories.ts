import { MenuPage } from "./menu-page";

export interface MenuCategories {
        name:string;
        expanded:boolean;
        pages: MenuPage[];
}
