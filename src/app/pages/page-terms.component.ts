import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'page-terms',
    templateUrl: 'page-terms.component.html'
})

export class TermsComponent implements OnInit {
  constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        this._instanceService.sendCustomEvent("TERMS")
     }
}