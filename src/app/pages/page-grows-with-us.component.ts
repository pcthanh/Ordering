import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { PickupService } from "../services/pickup.service";
import { NgBlockUI,BlockUI } from "ng-block-ui";
import { CandidateRequest } from "../models-request/candidate_reques";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { Candidate } from "../models/Candidate";

declare var $: any
@Component({
    selector: 'grows-us',
    templateUrl: 'page-grows-with-us.component.html'
})

export class GrowsWithUsComponent implements OnInit {
    nameFile:string="Choose file..."
    file:File;
    @BlockUI() blockUI: NgBlockUI;
    message:string=""
    candidateModel:Candidate;
    constructor(private _instanceService: EventSubscribeService,private _pickupService:PickupService) { 
       this.candidateModel = new Candidate();
    }

    ngOnInit() {
        window.scrollTo(0, 0);
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
    showSuccess1() {
        var el = $('#success-popup1');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    apllyNow() {

        this.showSuccess()
    }
    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', this.file, this.file.name);
            this.nameFile=this.file.name;
            // console.log("nemfile:"+ file.name)
            //  console.log("file:"+ (file.size))
            // let headers = new Headers();
            // /** In Angular 5, including the header Content-Type can invalidate your request */
            // headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            // let options = new RequestOptions({ headers: headers });
            // this.http.post(`${this.apiEndPoint}`, formData, options)
            //     .map(res => res.json())
            //     .catch(error => Observable.throw(error))
            //     .subscribe(
            //         data => console.log('success'),
            //         error => console.log(error)
            //     )
        }
    }
    gof3rIt(){
        this.blockUI.start();
        let fromData:FormData = new FormData();
        var [filename, extension] = this.file.name.split('.').reduce((acc, val, i, arr) => (i == arr.length - 1) ? [acc[0].substring(1), val] : [[acc[0], val].join('.')], [])
        fromData.append(extension, this.file, filename);
        this._pickupService.UploadImage(fromData).then(data=>{
            let urlFile = data.trim();
            if(urlFile!=""){
                let common_data = new CommonDataRequest();
                var _location = localStorage.getItem("la");
                common_data.Location = _location
                common_data.ServiceName = "AddCandidateContact";
                let common_data_json = JSON.stringify(common_data);
                let data_request = new CandidateRequest();
                data_request.Email = this.candidateModel.Email
                data_request.Name= this.candidateModel.Name
                data_request.Notes = this.candidateModel.Notes;
                data_request.Phone = this.candidateModel.Phone;
                let data_request_json = JSON.stringify(data_request);
                this._pickupService.AddCandidateContact(common_data_json,data_request_json).then(data=>{
                    
                    if(data.ResultCode==="000"){
                         $.magnificPopup.close()
                        this.message = "Thanks You! We’ll be in touch soon."
                        this.candidateModel = new Candidate();
                        this.showSuccess1();
                        this.blockUI.stop();
                    }
                    else{
                         $.magnificPopup.close()
                        this.message=data.ResultDesc;
                        this.showSuccess1();
                        this.blockUI.stop();
                    }
                })
            }
            else{
                 $.magnificPopup.close()
                this.message="Plase try again."
                this.showSuccess1();
                this.blockUI.stop();
            }
        });
    }
    
}