import { LucideIconData } from 'lucide-angular';

export interface MenuPage {
    name: string;
    route: string;
    icon:string;
    iconImage?: LucideIconData;
}
