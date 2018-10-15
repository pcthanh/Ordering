import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'gof3r-footer',
    templateUrl: 'gof3r-footer.component.html'
})

export class Gof3rFooterComponent implements OnInit {
    constructor(private _route:Router,private _instanceService:EventSubscribeService) { }

    ngOnInit() {
        
     }
    aboutClick(){
         
         this._instanceService.sendCustomEvent("About");
       
         this._route.navigateByUrl('/page-about')
    }
    faqClick(){
        this._instanceService.sendCustomEvent("FAQ");
       
         this._route.navigateByUrl('/page-faq')
    }
    privacyClick(){
        this._instanceService.sendCustomEvent("PRIVACY");
       
         this._route.navigateByUrl('/page-privacy')
    }
    termsClick(){
        this._instanceService.sendCustomEvent("TERMS");
       
         this._route.navigateByUrl('/page-terms')
    }
    contactClick(){
        this._instanceService.sendCustomEvent("ContactUS");
       
         this._route.navigateByUrl('/contact-us')
    }
}