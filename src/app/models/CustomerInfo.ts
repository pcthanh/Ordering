export class CustomerInfoModel{
    CustomerId:number;
    UserName:string;
    CustomerName:string;
    EnglishName:string;
    ShortName:string;
    Dob:Date;
    Pob:string;
    Gender:string;
    GenderValue:string;
    IdNumber:string;
    IdDate:string;
    IdPlace:string;
    IdExpire:string;
    MaritalStatus:string;
    MaritalStatusValue:string
    Address:string;
    CountryCode:string;
    CountryCodeValue:string;
    CityCode:string;
    CityCodeValue:string;
    PostalCode:string;
    CustomerImageFile:string=""
    Tel:string;
    Mobile:string;
    MobilePrefix:string;
    MobileWithoutPrefix:string;
    Fax:string;
    Email:string;
    ProfileImageURL:string;
    CompanyName:string;
    CompanyAddress:string;
    CompanyTel:string;
    CompanyFax:string;
    NeedUpdateProfile:boolean;
    NeedUpdateProfileNotification:string;
    NeedAddCardAccount:boolean;
    NeedAddCardAccountNotification:string;
    SandboxPointBalance:string;
    CashEquivalence:string;
    CurrencyCode:string;
    CurrencyCodeValue:string;
    NeedTopUpSandboxPointWallet:boolean;
    NeedTopUpSandboxPointWalletNotification:string;
    SandboxPointWalletId:string;
    SandboxPointWalletName:string;
    SandboxPointWalletLogo:string;
    SandboxPointWalletBalance;string;
    SandboxInsufficientMessage:string;
    SandboxPrepaidWalletId:string;
    SandboxCreditBalanceMessage:string;
    SandboxCreditBalanceDisplay:string;
    SandboxCreditBalance:string="";
    TotalUnreadNotifications:string;
    TotalUnreadMerchantNotifications:string;
    TotalUnreadSystemNotifications:string;
    Password:string=""
}