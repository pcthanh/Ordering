import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'page-faq',
    templateUrl: 'page-faq.component.html'
})

export class FAQComponent implements OnInit {
  constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        this._instanceService.sendCustomEvent("FAQ")
     }
}