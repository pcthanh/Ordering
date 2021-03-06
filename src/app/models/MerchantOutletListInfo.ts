import { SubCategoryListModel } from "../models/SubCategoryList";
import { DepartmentCategoryModel } from "../models/DepartmentCategory";
import { RecentOrderInfoModel } from "../models/RecentOrderInfo";
import { OffersListModel } from "../models/OffersList";
import { PickupTime } from "../models/PickupTime";
export class MerchantOutletListInfoModel{
    RowNum:number;
    MerchantId:string;
    MerchantName:string;
    MerchantLogoURL:string;
    MerchantRating:string;
    MerchantOutletId:string;
    MerchantOutletName:string;
    MerchantOutletImage:string;
    MerchantOutletRating:string;
    CityName:string;
    GeoLocation:string;
    OutletDistance:string;
    SubCategoryList:SubCategoryListModel[];
    EstimatedDeliveryTime:string="";
    EstimatedDeliveryDateTimeDisplay:string=""
    EstimatedDeliveryDateTimeValue:string=""
    OrderType:string=""
    SubCategoryStr:string;
    DepartmentCategoryList:DepartmentCategoryModel[];
    RecentOrderInfo:RecentOrderInfoModel[];
    PickupTimeInfo:PickupTime [] =[]
    OffersList:OffersListModel[]
    Address:string
    ResultCode:string="";
    CurrencyCode:string=""
    EstimatedPickupTime:string=""
    subCatgoryTemp:string="";
    Rating:string=""
    ProductWebsitePromotionalMessage:string=""
    ProductWebsitePromotionalBanner:string=""
    FoodCentreId:string="";
    FoodCentreName:string=""
    MaxOutletsInCart:number=0
    MessageForOrderMore:string=""
    IsBuyAndPayOutlet:string
;}