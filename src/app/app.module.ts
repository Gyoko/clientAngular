import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecretaryComponent } from './component/secretary/secretary.component';
import { InfirmierComponent } from './component/infirmier/infirmier.component';
import { PatientComponent } from './component/patient/patient.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag} from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './auth.guard';
import {RouterModule, Routes} from '@angular/router';

// les routes pour le login
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'secretary', component: SecretaryComponent, canActivate: [AuthGuard] }

];
// MODULES POUR LE EXPANDABLE LIST
const expandableListModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatExpansionModule
];



@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    InfirmierComponent,
    PatientComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // DRAG AND DROP MODULE POUR AFFECTATION DE PATIENTS A INFIRMIER
    DragDropModule,
    // FORMS MODULE POUR AJOUTER NGMODEL A BALISES INPUT
    FormsModule,
    // POUR LE EXPANDABLE LIST
    [...expandableListModules],
    // ANIMATION MODULE - PREMIERE UTILISATION DANS EXPANDABLE LIST
    BrowserAnimationsModule,
    // MODULE POUR LE LISTE DE PATIENTS NON AFFECTEES
    MatListModule,
    // MODULE POUR AUTOCOMPLETER LE NUMERO DE SEC. SOCIALE
    MatAutocompleteModule,
    // POUR FONCTION DE FORM CONTROL
    FormsModule,
    ReactiveFormsModule,
    // BUTTONS UTILISEES POUR CHOISIR LE MEDECIN TRAITENT DE PATIENTS EXISTANTS
    MatButtonToggleModule,
    // BUTTONS
    MatButtonModule,
    // pour la page de login
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

}
