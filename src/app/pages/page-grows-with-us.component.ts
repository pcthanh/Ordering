import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
declare var $:any
@Component({
    selector: 'grows-us',
    templateUrl: 'page-grows-with-us.component.html'
})

export class GrowsWithUsComponent implements OnInit {
    constructor(private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        window.scrollTo(0,0);
        this._instanceService.sendCustomEvent("GrowsUS")
     }
     
     showSuccess() {
        var el = $('#success-popup');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    apllyNow(){
        
        this.showSuccess()
    }
}