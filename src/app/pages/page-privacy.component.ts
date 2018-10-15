import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'page-privacy',
    templateUrl: 'page-privacy.component.html'
})

export class PrivacyComponent implements OnInit {
    constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        window.scrollTo(0,0);
        this._instanceService.sendCustomEvent("PRIVACY")
     }
}