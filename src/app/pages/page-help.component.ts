import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'page-help',
    templateUrl: 'page-help.component.html'
})

export class HelpComponent implements OnInit {
    constructor(private _instaneService:EventSubscribeService) { }

    ngOnInit() { 
        this._instaneService.sendCustomEvent("Help")
    }
}