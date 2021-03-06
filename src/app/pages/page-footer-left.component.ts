import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params,Router } from "@angular/router";
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'footer-left',
    templateUrl: 'page-footer-left.component.html'
})

export class FooterLeftComponent implements OnInit {
    isAbout:boolean=false;
    isFAQ:boolean=false;
    isPrivacy:boolean=false;
    isterms:boolean=false;
    isContactUS:boolean=false;
    isGrowsUS:boolean=false;
    constructor(private _route:Router,private _instanceService:EventSubscribeService) { 
        this._instanceService.$getEventSubject.subscribe(data=>{
            
            if(data==="About"){
                this.isAbout=true
            }
            if(data==="FAQ"){
                this.isFAQ=true;
            }
            if(data==="PRIVACY"){
                this.isPrivacy=true;
            }
            if(data==="TERMS"){
                this.isterms=true;
            }
            if(data==="ContactUS"){
                this.isContactUS=true;
            }
            if(data==="GrowsUS"){
                this.isGrowsUS=true;
            }
        })
    }

    ngOnInit() { 
        window.scrollTo(0,0);
        
    }
    aboutClick(){
        this.isAbout=true;
        this.isFAQ=false;
        this.isPrivacy=false;
        this.isterms=false;
        this.isContactUS=false;
        this.isGrowsUS=false;
        this._instanceService.sendCustomEvent('About')
        this._route.navigateByUrl('/page-about')
    }
    faqClick(){
        this.isAbout=false;
        this.isFAQ=true
        this.isPrivacy=false;
        this.isterms=false
        this.isContactUS=false;
        this.isGrowsUS=false;
        this._instanceService.sendCustomEvent('FAQ')
        this._route.navigateByUrl('/page-faq')
    }
    privacyClick(){
        this.isAbout=false;
        this.isFAQ=false
        this.isPrivacy=true;
        this.isterms=false
        this.isContactUS=false;
        this.isGrowsUS=false;
        this._instanceService.sendCustomEvent('PRIVACY')
        this._route.navigateByUrl('/page-privacy')
    }
    termsClick(){
        this.isAbout=false;
        this.isFAQ=false
        this.isPrivacy=false;
        this.isterms=true
        this.isContactUS=false;
        this.isGrowsUS=false;
        this._instanceService.sendCustomEvent('TERMS')
        this._route.navigateByUrl('/page-terms')
    }
    ContactClick(){
        this.isAbout=false;
        this.isFAQ=false
        this.isPrivacy=false;
        this.isterms=false
        this.isContactUS=true;
        this.isGrowsUS=false;
        this._instanceService.sendCustomEvent('ContactUS')
        this._route.navigateByUrl('/contact-us')
    }
    Grows(){
        this.isAbout=false;
        this.isFAQ=false
        this.isPrivacy=false;
        this.isterms=false
        this.isContactUS=false;
        this.isGrowsUS=true;
        this._instanceService.sendCustomEvent('Grows')
        this._route.navigateByUrl('/grows-with-us')
    }
}