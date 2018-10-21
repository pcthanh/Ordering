import { MerchantOutletListInfoModel } from "../models/MerchantOutletListInfo";
export class GetAllOutletListV2Model
{
    CartInfo:string;
    ProductWebsitePromotionalMessage:string="";
    ProductWebsitePromotionalBanner:string=""
    MerchantOutletListInfo:MerchantOutletListInfoModel[];
    NoMessageDataForOutletList:string;
    NoMessageDataForSearchOutletList:string;
    NoMessageDataForChangingDeliveryTime:string;
    NoMessageDataForChangingLocation:string;
    ResultCode:string;
    ResultDesc:string;
    ServiceName:string;

}