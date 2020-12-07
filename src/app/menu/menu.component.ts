import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Menu = "home" | "list" | "add";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Input() public selectedMenu: Menu;
    @Output() public selectedMenuChange = new EventEmitter<Menu>();

}
