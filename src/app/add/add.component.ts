import { Component, OnInit } from '@angular/core';
import { DBserviceService } from "../dbservice.service";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {

  constructor(public dbservice: DBserviceService) { }

  ngOnInit(): void {
  }

}
