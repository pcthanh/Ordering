import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'about',
    templateUrl: 'page-about.component.html'
})

export class AboutComponent implements OnInit {
    constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        window.scrollTo(0,0);
        this._instanceService.sendCustomEvent("About")
     }
}