import { Component, OnInit } from "@angular/core";
import { Menu } from "./menu/menu.component";
import { DBserviceService } from "./dbservice.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'beadando';

    public menu: Menu = "home";

    constructor(private dbservice: DBserviceService) {}

    public ngOnInit(): void {
        this.dbservice.init();
        this.dbservice.updatingRings();
    }
}
