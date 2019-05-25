import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Gof3rHomeComponent } from "./pages/gof3r-home.component";
import { HocComponent } from "./pages/tes.component";
import { SearchResultComponent } from "./pages/search-result.component";
import { PageOrderComponent } from "./pages/page-order.component";
import { PageCheckOutComponent } from "./pages/page-checkout.component";
import { FotgotPasswordComponent } from "./pages/gof3r-forgot-password.component";
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
import { GrowsWithUsComponent } from "./pages/page-grows-with-us.component";
import { ChangePasswordComponent } from "./pages/page-change-password.component";
// Begin ThanhPC 25/05/2019
import { NetPaymentComponent } from "./pages/page.netPayment.component";
// End ThanhPC 25/05/2019
const routes: Routes = [
    
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: Gof3rHomeComponent },
    { path: 'search-result',component:SearchResultComponent},
    { path: 'order',component:PageOrderComponent},
    { path: 'check-out',component:PageCheckOutComponent},
    { path: 'forgot-password',component:FotgotPasswordComponent},
    { path: 'become-courier',component:BecomeCourierComponent},
    { path: 'restaurant-owner',component:RetaurantOwnerComponent},
    { path: 'contact-us',component:ContactUsComponent},
    { path: 'footer-left',component:FooterLeftComponent},
    { path: 'page-about',component:AboutComponent},
    { path: 'page-faq',component:FAQComponent},
    { path: 'page-privacy',component:PrivacyComponent},
    { path: 'page-terms',component:TermsComponent},
    { path: 'tracker-order/:orderType/:customerOrderId',component:TrackerOrderComponent},
    { path: 'account',component:AccountComponent},
    { path: 'account-menu',component:MyAccountMenuComponent},
    { path: 'order-history',component:OrderHistoryomponent},
    { path: 'invite',component:InvietFriendComponent},
    { path: 'help',component:HelpComponent},
    { path: 'payment-option',component:PaymentOptionComponent},
    { path: 'delivery-address',component:DeliveryAddressComponent},
    { path: 'order-history-pickup',component:OrderHistoryPickupComponent},
    { path: 'order-history-detail/:orderType/:customerOrderId',component:OrderHistoryDetailComponent},
    { path: 'grows-with-us',component:GrowsWithUsComponent},
    { path: 'change-password',component:ChangePasswordComponent},
    // Begin ThanhPC 25/05/2019
    { path: 'netpayment',component:NetPaymentComponent},
    // ENd ThanhPC 25/05/2019
    { path: 'hoc', component: HocComponent },
    
]
export const routing = RouterModule.forRoot(routes);