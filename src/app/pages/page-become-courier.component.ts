import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
    selector: 'become-courier',
    templateUrl: 'page-become-courier.component.html'
})

export class BecomeCourierComponent implements OnInit {
    constructor() { }

    ngOnInit() { 
        window.scrollTo(0,0);
         $('html,body').animate({
                scrollTop: $(".header-wrap").offset().top
            });
    }
}