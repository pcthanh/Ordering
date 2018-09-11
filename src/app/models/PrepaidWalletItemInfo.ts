import { CustomerTranxFeeModel } from "../models/CustomerTranxFee";
import { RebateProgramInfoItem } from "../models/RebateProgramInfoItem";
export class PrepaidWalletItemInfo{
    RowNum:string=""
    WalletNo:string=""
    WalletName:string=""
    IsFavorite:string=""
    MerchantId:string=""
    MerchantIdValue:string=""
    MerchantIdImg:string=""
    WalletTypeId:string=""
    WalletTypeIdValue:string=""
    WalletStatusId:string=""
    WalletStatusIdValue:string=""
    CurrencyCode:string=""
    CurrencyCodeValue:string=""
    IssueDate:string=""
    ExpiryDate:string=""
    CloseDate:string=""
    RenewalCount:string=""
    LastRenewalDate:string=""
    BlockDate:string=""
    UnblockDate:string=""
    WalletDefaultValue:string=""
    Balance:string=""
    BalanceDisplay:string=""
    TotalSpend:string=""
    LastSpendAmount:string=""
    LastSpendDate:string=""
    TotalReload:string=""
    LastReloadAmount:string=""
    LastReloadDate:string=""
    TotalTransfer:string=""
    LastTransferAmount:string=""
    LastTransferDate:string=""
    TotalReceive:string=""
    LastReceiveAmount:string=""
    LastReceiveDate:string=""
    CustomerTranxFee:CustomerTranxFeeModel[]=[]
    HavingPromotion:string=""
    ExisteImg:boolean=false
    RebateProgramInfo:RebateProgramInfoItem[]=[]
    PrepaidDenominations:string=""
    
}