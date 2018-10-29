import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { ListDeliveryAddress } from "../models/ListDeliveryAddress";
import { Gof3rModule } from "../util/gof3r-module";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { PickupService } from "../services/pickup.service";
import { Gof3rUtil } from "../util/gof3r-util";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Router } from "@angular/router";
import { ViewChild, ElementRef, NgZone } from '@angular/core'
import { FormControl, NgModel } from '@angular/forms';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { AddeliveryAddressModel } from "../models-request/add-delivery-address";
import { AddressAdd } from "../models/AddressAdd";
import { HomeService } from "../services/home.service";
declare var $: any;
@Component({
    selector: 'delivery-address',
    templateUrl: 'page-delivery.component.html'
})

export class DeliveryAddressComponent implements OnInit {
    listDeliveryAddress: ListDeliveryAddress;
    customerInfoMain: CustomerInfoMainModel;
    public searchControl: FormControl;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    lat: number = 0;
    lng: number = 0;
    addressAdd: AddressAdd;
    addressId: string = ""
    showListSelectAddress: boolean = false;
    list: any[] = [];
    inputAddress: string = ""
    constructor(private _homeservice: HomeService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _route: Router, private _instaneService: EventSubscribeService, private _gof3rModule: Gof3rModule, private _pickupService: PickupService, private _gof3rUtil: Gof3rUtil) {
        this.listDeliveryAddress = new ListDeliveryAddress();
        this.customerInfoMain = new CustomerInfoMainModel();
        this.addressAdd = new AddressAdd();
        if (localStorage.getItem("cus") != null) {
            this.customerInfoMain = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem("cus")));

        }
        else {
            this._route.navigateByUrl("/home");
        }
    }

    ngOnInit() {
        this.searchControl = new FormControl();
        // this.mapsAPILoader.load().then(() => {
        //     let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        //         types: ["geocode"]
        //     });
        //     autocomplete.addListener("place_changed", () => {
        //         this.ngZone.run(() => {
        //             //get the place result
        //             let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //             //verify result
        //             if (place.geometry === undefined || place.geometry === null) {
        //                 return;
        //             }

        //             //set latitude, longitude and zoom
        //             this.lat = place.geometry.location.lat();
        //             this.lng = place.geometry.location.lng();
        //             // localStorage.setItem('lat', this.lat + '');
        //             // localStorage.setItem('long', this.lng + '');
        //             // localStorage.setItem('la', this.lat + ',' + this.lng + "#_#_")

        //         });
        //     });
        // });
        this._instaneService.sendCustomEvent("DeliveryAddress")
        this.DeliveryAddress()
    }
    checkInputPostalCode(event) {
        var postal_code: string = event.target.value;

        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "SearchSingaporeAddress";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { SearchValue: postal_code };
        let request_data_json = JSON.stringify(data_request);
        this._pickupService.SearchSingaporeAddress(common_data_json, request_data_json).then(data => {

            this.list = data;
            this.showListSelectAddress = true;
            // for(let i = 0; i< data.AddressList.length; i++){
            //     this.list.push({name:data.AddressList[i].Address,postalCode:data.AddressList[i].PostalCode,lat:data.AddressList[i].Latitude,lng:data.AddressList[i].Longitude})

            // }

        })
    }
    selectAddress(addres: string, lat: string, lng: string) {
        this.inputAddress = addres;
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng)
        this.showListSelectAddress = false;
    }

    DeliveryAddress() {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryAddresses";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { CustomerId: this.customerInfoMain.CustomerInfo[0].CustomerId };
        let data_request_json = JSON.stringify(data_request);

        this._pickupService.GetDeliveryAddresses(common_data_json, data_request_json).then(data => {
            this.listDeliveryAddress = data;
            this._gof3rModule.checkInvalidSessionUser(this.listDeliveryAddress.ResultCode);

        })
    }

    addDeliveryAddress() {
        if (this.lat > 0 && this.lng > 0) {
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "AddDeliveryAddress";
            let common_data_json = JSON.stringify(common_data);

            let data_request = new AddeliveryAddressModel();




            this.addressAdd.Location = this.inputAddress;
            data_request.Address = this.addressAdd.Location;
            data_request.ApartmentNoBuildingName = this.addressAdd.AparmentNo
            data_request.InstructionForRider = this.addressAdd.InstructionForRider;
            data_request.Nickname = "";
            data_request.PhoneNumber = this.addressAdd.PhoneNumber
            data_request.PostalCode = this.addressAdd.PostalCode
            data_request.CustomerId = this.customerInfoMain.CustomerInfo[0].CustomerId + ''
            data_request.GeoLocation = this.lat + ',' + this.lng;
            let data_request_json = JSON.stringify(data_request);

            this._pickupService.AddDeliveryAddress(common_data_json, data_request_json).then(data => {

                if (data.ResultCode === '000') {

                    this.DeliveryAddress()
                    this.lat = 0;
                    this.lng = 0;
                    $("#input-address-1").val("");

                }
            })

        }
    }
    deleteAddress(name: string, id: string) {
        this.addressId = id;
        this.showPopupDelete()
    }
    showPopupDelete() {
        var el = $('#delete-address');
        if (el.length) {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline'
            });
        }
    }
    cancelDelete() {
        this.addressId = ""
        $.magnificPopup.close()
    }
    acceptedDelete() {
        if (this.addressId != "") {
            let common_data = new CommonDataRequest();
            var _location = localStorage.getItem("la");
            common_data.Location = _location
            common_data.ServiceName = "DeleteDeliveryAddress";
            let common_data_json = JSON.stringify(common_data);

            let data_request = { AddressId: this.addressId }
            let data_request_json = JSON.stringify(data_request)

            this._pickupService.DeleteDeliveryAddress(common_data_json, data_request_json).then(data => {

                if (data.ResultCode === "000") {
                    $.magnificPopup.close()
                    this.DeliveryAddress();

                }
            })
        }

    }
}