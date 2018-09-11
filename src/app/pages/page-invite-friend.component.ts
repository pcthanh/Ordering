import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";

@Component({
    selector: 'invite',
    templateUrl: 'page-invite-friend.component.html'
})

export class InvietFriendComponent implements OnInit {
    constructor(private _instaneService:EventSubscribeService) { }

    ngOnInit() { 
        this._instaneService.sendCustomEvent("Invite");
    }
}