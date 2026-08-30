import { Component } from '@angular/core';

import { RouterModule } from "@angular/router";
import { SideBarComponent } from "../side-bar-component/side-bar-component";
import { HeaderComponent } from "../header-component/header-component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, SideBarComponent, HeaderComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
