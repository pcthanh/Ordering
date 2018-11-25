import { ProductDetailParseModel } from "../models/ProductDetailParse";
export class CartOrder{
    OrderType:string="";
    OuteletID:string=""
    MerchantID:string=""
    OutletName:string=""
    OutletRating:string=""
    Total:number=0;
    TotalDisplay:string=""
    FoodCenterID:string=""
    Cart:ProductDetailParseModel []=[];
    MaxOutletInCart:number=0
    FoodCenterName:string=""
}