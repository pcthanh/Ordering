import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule,NgModel } from '@angular/forms';


import { AppComponent } from './app.component';
// import{ ThanhComponent } from "./pages/test.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//Import Component

import { routing} from "./routing";
import { HttpModule,JsonpModule, Jsonp, Response } from "@angular/http";
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import {Routes, RouterModule} from "@angular/router";

import { BlockUIModule } from 'ng-block-ui';

import { AgmCoreModule,MapsAPILoader } from '@agm/core';

import { DropdownModule} from 'primeng/primeng';
import { HomeService } from "./services/home.service";
import { Gof3rUtil } from "./util/gof3r-util";
import { PickupService } from "./services/pickup.service";
import { EventSubscribeService } from './services/instance.service';

import { Gof3rModule } from "./util/gof3r-module";

import { Gof3rHomeComponent } from "./pages/gof3r-home.component";
import { Gof3rFooterComponent } from "./widgets/gof3r-footer.component";

import { HocComponent } from "./pages/tes.component";
import { SearchResultComponent } from "./pages/search-result.component";
import { PageOrderComponent } from "./pages/page-order.component";
import { HeaderGof3rComponent } from "./widgets/header.component";
import { PageCheckOutComponent } from "./pages/page-checkout.component";
import { FotgotPasswordComponent } from "./pages/gof3r-forgot-password.component";

import { HeaderCheckOutComponent } from "./widgets/header-checkout.component";
import { BecomeCourierComponent } from "./pages/page-become-courier.component";
import { RetaurantOwnerComponent } from "./pages/page-restaurant-owners.component";
import { ContactUsComponent } from "./pages/page-contact-us.component";
import { FooterLeftComponent } from "./pages/page-footer-left.component";
import { AboutComponent } from "./pages/page-about.component";
import { FAQComponent } from "./pages/page-faq.component";
import { PrivacyComponent } from "./pages/page-privacy.component";
import { TermsComponent } from "./pages/page-terms.component";
import { TrackerOrderComponent } from "./pages/page-tracker-order.component";
import { AccountComponent } from "./pages/page-account.component";
import { MyAccountMenuComponent } from "./pages/page-myaccount-menu.component";
import { OrderHistoryomponent } from "./pages/page-order-history.component";
import { InvietFriendComponent } from "./pages/page-invite-friend.component";
import { HelpComponent } from "./pages/page-help.component";
import { PaymentOptionComponent } from "./pages/page-payment-option.component";
import { DeliveryAddressComponent } from "./pages/page-delivery.component";
import { OrderHistoryPickupComponent } from "./pages/page-order-history-pickup.component";
import { OrderHistoryDetailComponent } from "./pages/page-order-history-detail.component";
import { LocationStrategy,HashLocationStrategy } from "@angular/common";
import {NgAutoCompleteModule} from "ng-auto-complete";
import { AutoCompleteModule } from 'ng4-auto-complete';
import {CalendarModule} from 'primeng/calendar';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardModule } from 'ngx-clipboard';
import { GrowsWithUsComponent } from "./pages/page-grows-with-us.component";
import { OwlModule } from 'angular-owl-carousel';
import {NgxMaskModule} from 'ngx-mask'
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular5-social-login";
import { ChangePasswordComponent } from "./pages/page-change-password.component";
// Begin ThanhPC 25/05/2019
import { NetPaymentComponent  } from "./pages/page.netPayment.component";
// End ThanhPC 25/05/2019
// let config = new AuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider("828794768516-2kds86k22n6a5epe9jso4tn176t619l3.apps.googleusercontent.com")
//   },
//   {
//     id: FacebookLoginProvider.PROVIDER_ID,
//     provider: new FacebookLoginProvider("202766530652511")
//   }
// ]);

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("202766530652511")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("828794768516-2kds86k22n6a5epe9jso4tn176t619l3.apps.googleusercontent.com")
        },
      ]
  )
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
   
    Gof3rHomeComponent,
    Gof3rFooterComponent,
    HocComponent,
    SearchResultComponent,
    PageOrderComponent,
    HeaderGof3rComponent,
    PageCheckOutComponent,
    FotgotPasswordComponent,
    HeaderCheckOutComponent,
    BecomeCourierComponent,
    RetaurantOwnerComponent,
    ContactUsComponent,
    FooterLeftComponent,
    AboutComponent,
    FAQComponent,
    PrivacyComponent,
    TermsComponent,
    TrackerOrderComponent,
    AccountComponent,
    MyAccountMenuComponent,
    OrderHistoryomponent,
    InvietFriendComponent,
    HelpComponent,
    PaymentOptionComponent,
    DeliveryAddressComponent,
    OrderHistoryPickupComponent,
    OrderHistoryDetailComponent,
    GrowsWithUsComponent,
    ChangePasswordComponent,
    // Begin ThanhPC 25/05/2019
    NetPaymentComponent
    // ENd ThanhPC 25/05/2019
    //Import Component

    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    routing,
  
    BlockUIModule.forRoot(),
  CalendarModule,
 DropdownModule,ClickOutsideModule,
 ClipboardModule,
    
     AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAVdsuXFE3Ca3vwy_lopgMUHTfJLdd3_Ck',libraries:["places"],
        apiVersion: "4"
       //apiKey:''
     }),
    ReactiveFormsModule,
    HttpModule,
   
    JsonpModule,
    HttpClientJsonpModule,
    HttpClientModule,
    NgAutoCompleteModule,
    AutoCompleteModule,
    SocialLoginModule,
    OwlModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    EventSubscribeService,
    HomeService,
    Gof3rUtil,
    NgModel,
    PickupService,
    Gof3rModule,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
