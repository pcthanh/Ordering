import { CustomerTranxFeeModel } from "../models/CustomerTranxFee";
export class CardInfoModel{
    RowNum:string=""
    MaskedCardNumber:string=""
    ExpiryDate:string=""
    CardToken;string=""
    PaymentGatewayToken:string=""
    CardAlias:string=""
    Bin:string=""
    BinValue:string=""
    BinImg:string=""
    VnpayBin:string=""
    CardStatusId:string=""
    CardStatusIdValue:string=""
    CardTypeId:string=""
    CardTypeIdValue:string=""
    CardTypeIdImg:string=""
    CardProductId:string=""
    CardProductIdValue:string=""
    CardProductIdImg:string=""
    IssuingCountryCode:string=""
    IssuingCountryCodeValue:string=""
    IssuingCountryAlpha2:string=""
    IsFavorite:string=""
    LastLockedOn:string=""
    LastUnlockedOn:string=""
    CustomerTranxFee:CustomerTranxFeeModel[]=[]
    HavingPromotion:string;
    CardHolderName:string;
    Cvv2:string;

}