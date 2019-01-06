import { Component } from '@angular/core';
import {SecretaryComponent} from './component/secretary/secretary.component';
import {CabinetMedicalService} from './cabinet-medical.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private secretary: SecretaryComponent;
  title = 'clientAngular';

  constructor() {}
}

