import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { NewTCodeComponent } from './new-tcode/new-tcode.component';
import { ExistingTCodeComponent } from './existing-tcode/existing-tcode.component';
import { ToolDrawingRetrivalComponent } from './tool-drawing-retrival/tool-drawing-retrival.component';
import { ToolDrawingSummaryComponent } from './tool-drawing-summary/tool-drawing-summary.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

// import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from './header/header.component';
import { EditTCodeComponent } from './edit-t-code/edit-t-code.component';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
// import { MyUtils } from './utils/comman';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AdminDashboardComponent,
    OtpScreenComponent,
    NewTCodeComponent,
    ExistingTCodeComponent,
    ToolDrawingRetrivalComponent,
    ToolDrawingSummaryComponent,
    HeaderComponent,
    EditTCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapMultiselectModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor, MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [{provide : LocationStrategy , useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
