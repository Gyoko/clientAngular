import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  constructor() { }

  // INFO SUR PATIENT QUI EST PASSE PAR NGFOR DANS SECRETARY COMPONENT
  @Input() patientInput

  // (previousContainer, container, previousIndex) PASSEE AU SECRETAIRE
  @Output() containerEvent = new EventEmitter();

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    // EMITTER
    if ( event.previousContainer !== event.container) {
      this.containerEvent.emit([event.previousContainer, event.container, event.previousIndex]);
    }
  }

}
