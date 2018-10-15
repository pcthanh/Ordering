import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'contact-us',
    templateUrl: 'page-contact-us.component.html'
})

export class ContactUsComponent implements OnInit {
    constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() { 
        window.scrollTo(0,0);
        this._instanceService.sendCustomEvent("ContactUS")
    }
}