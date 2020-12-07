import { Component, OnInit } from '@angular/core';
import { DBserviceService } from "../dbservice.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(public dbservice: DBserviceService) { }

  ngOnInit(): void {
  }

}
