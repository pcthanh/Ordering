import { Injectable,Inject, Injector } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'
import { Gof3rUtil } from "../util/gof3r-util";
import { RegisterCustomerDevice } from "../models/RegisterCustomerDevice";
import { GetInitialParams } from "../models/GetInitialParams";

@Injectable()
export class HomeService{
     constructor(public util:Gof3rUtil, private http: Http) { }

     registerDevice(requesData:string):Promise<RegisterCustomerDevice>{
        let urlApi =this.util.urlAPI()+this.util.encrypt(requesData);
        console.log('urlDevice:'+ urlApi)
        return this.http.get(urlApi).toPromise().then(data=>{
            return Promise.resolve(JSON.parse(this.util.decryptByDES(data.text())) as RegisterCustomerDevice)
        });
    }

    registerDevice1(requesData:string):Observable<RegisterCustomerDevice>{
        let urlApi =this.util.urlAPI()+this.util.encrypt(requesData);
        return this.http.get(urlApi).map(data=>JSON.parse(this.util.decryptByDES(data.text()))as RegisterCustomerDevice)
    }
    getLocationAddress(lat:number, long:number){
        let urlGoogleAPI="https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat+","+long+"&key=AIzaSyAcuXzA_6raMbgdAqRtq_4a0maw6EionEE"
        return this.http.get(urlGoogleAPI).toPromise().then(data=>{
            //console.log("thanh:"+data.text())
            return Promise.resolve(JSON.parse(data.text()));
        });
    }
    getServiceHome(commonData:string, requestData:string){
        let urlAPI = this.util.urlAPI()+this.util.encryptKEK(commonData)+"/"+ this.util.encryptAPIWorking(requestData);
        console.log("re:"+ urlAPI);
        return this.http.get(urlAPI).toPromise().then(data=>{
              return Promise.resolve(JSON.parse(this.util.decryptByDESAPIWorking(data.text())) as GetInitialParams);
          })
    }
}
