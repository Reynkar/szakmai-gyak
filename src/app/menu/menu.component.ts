import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DBserviceService } from "../dbservice.service";

export type Menu = "home" | "list" | "add";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(public dbservice: DBserviceService) { }

  @Input() public selectedMenu: Menu;
    @Output() public selectedMenuChange = new EventEmitter<Menu>();

}
