import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { GetInitialParams } from "../models/GetInitialParams";
import { Gof3rUtil } from "../util/gof3r-util";
import { ClipboardService } from 'ngx-clipboard'
@Component({
    selector: 'invite',
    templateUrl: 'page-invite-friend.component.html'
})

export class InvietFriendComponent implements OnInit {
    getInitialParams: GetInitialParams;
    textCopy:string="COPY LINK";
    constructor(private _instaneService:EventSubscribeService,private _util:Gof3rUtil,private _clipboardService: ClipboardService) { 
        this.getInitialParams = new GetInitialParams();
        if(localStorage.getItem("IN")!=null){
            this.getInitialParams = JSON.parse(this._util.decryptByDESParams(localStorage.getItem("IN")));
            
        }
    }

    ngOnInit() { 
        this._instaneService.sendCustomEvent("Invite");
    }
    copyToClipboard(element) {
    this._clipboardService.copyFromContent(element);
    this.textCopy="Copied";
  }
}