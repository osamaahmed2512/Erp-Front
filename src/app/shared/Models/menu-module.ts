import { MenuCategories } from "./menu-categories";
import { MenuPage } from "./menu-page";

export interface MenuModule {
    name: string;
    icon: string;
    expanded: boolean;
    categories: MenuCategories[]
}
