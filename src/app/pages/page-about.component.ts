import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'about',
    templateUrl: 'page-about.component.html'
})

export class AboutComponent implements OnInit {
    constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        this._instanceService.sendCustomEvent("About")
     }
}