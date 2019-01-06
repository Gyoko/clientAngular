import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {PatientInterface} from '../../dataInterfaces/patient';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() infirmier;
  imgSrc: string;

  constructor() {}
  // INFO SUR INFIRMIER QUI EST PASSE PAR NGFOR DANS SECRETARY COMPONENT
  @Input() infirmierInput;

  // (previousContainer, container, previousIndex) PASSEE AU SECRETAIRE
  @Output() containerEvent = new EventEmitter();

  ngOnInit() {
    console.log('INFIRMIERINPUT');
    console.log(this.infirmierInput.patients);
    this.imgSrc = 'data/' + this.infirmierInput.photo;
  }


  drop(event: CdkDragDrop<string[]>) {
    // EMITTER
    if ( event.previousContainer !== event.container) {
      this.containerEvent.emit([event.previousContainer, event.container, event.previousIndex]);
    }
  }


}
