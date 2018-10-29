import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
declare var $: any;

@Component({
    selector: 'restaurant-owner',
    templateUrl: 'page-restaurant-owners.component.html'
})

export class RetaurantOwnerComponent implements OnInit {
    constructor(private _instanceService: EventSubscribeService) {
        this._instanceService.$getEventSubject.subscribe(data => {
            window.scrollTo(0, 0);
        })
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.initButton()
        $('html,body').animate({
                scrollTop: $(".header-wrap").offset().top
            });
        
    }
    initButton() {
        $("#btnStart").click(function () {

            $('html,body').animate({
                scrollTop: $(".form-apply").offset().top
            },
                'slow');
        });
    }
}