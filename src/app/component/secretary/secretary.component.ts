import {Component, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../../cabinet-medical.service';
import {CabinetInterface} from '../../dataInterfaces/cabinet';
import {PatientInterface} from '../../dataInterfaces/patient';
import {sexeEnum} from '../../dataInterfaces/sexe';
import {Adresse} from '../../dataInterfaces/adresse';
import {InfirmierInterface} from '../../dataInterfaces/infirmier';
// DRAGGABLE VIEW POUR LES SECTIONS DES INFIRMIERS
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {not} from 'rxjs/internal-compatibility';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})

export class SecretaryComponent implements OnInit {
  private _cabinet: CabinetInterface;
  private cabinetMedicalservice: CabinetMedicalService;
  private prenomVal = '';
  private nomVal = '';
  private secVal = '';
  private rueVal = '';
  private villeVal = '';
  private etageVal = '';
  private numVal = '';
  private codeVal = '';
  private naissVal = '';
  private fVal = false;
  private mVal = false;
  private options: string[];

  private affichage_div=false;
  id: string;


  constructor(cabinetMedicalService: CabinetMedicalService,private router: Router, public authService: AuthService) {
    this.cabinetMedicalservice = cabinetMedicalService;
    this.initCabinet(cabinetMedicalService);
  }

  public get cabinet(): CabinetInterface {
    return this._cabinet;
  }

  async initCabinet(cabinetMedicalService) {
    this._cabinet = await cabinetMedicalService.getData('/data/cabinetInfirmier.xml');
  }

  ngOnInit() {
    this.id = localStorage.getItem('token');
  }

  // RECUPERER TOUS LES INFIRMIERS AVEC LEURS INFOS
  get infirmiers(): InfirmierInterface[] {
    return this._cabinet.infirmiers;
  }

  get patientsNonAffectees(): PatientInterface[] {
    return this._cabinet.patientsNonAffectes;
  }

  // RECHERCHER LES IDS DE TOUS LES INFIRMIERS
  get infirmiersId(): string[] {
    const numeros = [];
    if (this.infirmiers !== null) {
      for (const infirmier of this.infirmiers) {
        numeros.push(infirmier.id);
      }
      console.log('NUMEROS');
      console.log(numeros);
      this.options = numeros;
      numeros.push('none');
      return numeros;
    }
    return [];
  }

  // METHODE QUI TRAITE LE CAS OU ON A CREER NOUVEAU PATIENT
  addPatient(prenom: string, nom: string, sec: string, M: boolean, F: boolean,
             ville: string, rue: string, numero: string, etage: string, cp: string, date: string, infirmier: string) {
    // CAS - IL FAUT AJOUTER A PATIENTS NON AFFECTEES
    if (infirmier === 'none') {
      // MISE A JOUR DE SERVEUR
      this.cabinetMedicalservice.postAdd(prenom, nom, sec, M, F, ville, rue, numero, etage, cp, date);
      //
      // MISE A JOUR LOCALE
      const adr: Adresse = {
        ville: ville,
        codePostal: Number(cp),
        rue: rue,
        numero: numero,
        etage: etage === 'undefined' ? '' : etage
      };
      const patient: PatientInterface = {
        prenom: prenom,
        nom: nom,
        sexe: (M) ? sexeEnum.M : sexeEnum.F,
        numeroSecuriteSociale: sec,
        adresse: adr,
        id: null
      };
      this._cabinet.patientsNonAffectes.push(patient);
      // CAS - IL FAUT AJOUTER A INFIRMIERS
    } else {
      // MISE A JOUR DE SERVEUR
      this.cabinetMedicalservice.postCreate(prenom, nom, sec, M, F, ville, rue, numero, etage, cp, date, infirmier);
      //
      // MISE A JOUR LOCALE
      // CREATION DE PATIENT INTERFACE
      const adr: Adresse = {
        ville: ville,
        codePostal: Number(cp),
        rue: rue,
        numero: numero,
        etage: etage === 'undefined' ? '' : etage
      };
      const patient: PatientInterface = {
        prenom: prenom,
        nom: nom,
        sexe: (M) ? sexeEnum.M : sexeEnum.F,
        numeroSecuriteSociale: sec,
        adresse: adr,
        id: infirmier
      };
      // TROUVER LE LISTE ET AJOUTER PUSH
      for (const inf of this._cabinet.infirmiers) {
        if (inf.id === infirmier) {
          inf.patients.push(patient);
        }
      }
    }
  }

  // VIDER LES INPUTS DE CARTE DE NOUVEAU PATIENT
  vider() {
    this.prenomVal = null;
    this.nomVal = null;
    this.secVal = null;
    this.rueVal = null;
    this.villeVal = null;
    this.etageVal = null;
    this.numVal = null;
    this.codeVal = null;
    this.naissVal = null;
    this.fVal = false;
    this.mVal = false;
  }

  // GESTION DE DRAG AND DROP EVENEMENT DE CARTE DE NOUVELLE PATIENT
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
    } else {
      if (event.container.id === 'none') {
      } else if (this.infirmiersId.includes(event.container.id)) {
      }
    }
  }

  // METHODE POUR TRAITER LE MODIFICATION DE DONNEES DE PATIENT EXISTANT
  updatePatient(infirmierChoisi: string, patientChoisi: string, oldInfirmier: string) {
    // MISE A JOUR SERVEUR
    this.cabinetMedicalservice.postAffectation(infirmierChoisi, patientChoisi);
    //
    // MISE A JOUR LOCALE
    // TROUVER DES LISTES DE PATIENTS
    let newPatients: PatientInterface[];
    let targetPatient: PatientInterface;
    let i = 0;
    let j = 0;
    // SI PATIENT ETE DANS none
    if (oldInfirmier === 'none') {
      for (const p of this._cabinet.patientsNonAffectes) {
        if (p.numeroSecuriteSociale === patientChoisi) {
          targetPatient = p;
          console.log(targetPatient);
          console.log(this._cabinet.patientsNonAffectes);
          console.log(this._cabinet.patientsNonAffectes.splice(j, 1));
        }
        j++;
      }
    }
    for (const inf of this._cabinet.infirmiers) {
      if (inf.id === infirmierChoisi) {
        newPatients = inf.patients;
      } else if (inf.id === oldInfirmier) {
        // EFFACER PATIENT DANS oldPatients
        for (const p of inf.patients) {
          if (p.numeroSecuriteSociale === patientChoisi) {
            targetPatient = p;
            const index = this._cabinet.infirmiers[i].patients.indexOf(p);
            console.log(this._cabinet.infirmiers[i].patients);
            console.log(this._cabinet.infirmiers[i].patients.splice(index, 1));
          }
        }
      }
      i++;
    }
    if (infirmierChoisi === 'none') {
      this._cabinet.patientsNonAffectes.push(targetPatient);
    } else {
      // AJOUTER PATIENT DANS newPatients
      newPatients.push(targetPatient);
    }

  }

  // METHODE QUI EST APPELLEE PAR EMITTEUR DE DRAGNDROP COMPONENT DE INFIRMIER/PATIENT
  // ELLE RECUPERE LES INFORMATION CONCERNANT QUELLE ITEM ETE DEPLACEE OU
  // ET APRES ELLE FAIT APPEL A updatePatient/addPatient RESPECTIVEMENT
  editPatient(event: any[]) {
    const previousContainer = event[0];
    const container = event[1];
    const index = +event[2];
    let infirmier: string;
    let patient: string;
    // CHANGEMENT D'INFO DE PATIENT EXISTANT
    if (previousContainer.id !== 'masterList' && container.id !== 'masterList') {
      infirmier = container.id;
      // PATIENT DE INFIRMIER
      if (previousContainer.id !== 'none') {
        for (const inf of this._cabinet.infirmiers) {
          if (inf.id === previousContainer.id) {
            patient = inf.patients[index].numeroSecuriteSociale;
          }
        }
      } else { // PATIENT NON AFFECTEE
        patient = this._cabinet.patientsNonAffectes[index].numeroSecuriteSociale;
      }
      this.updatePatient(infirmier, patient, previousContainer.id);
    } else if (previousContainer.id === 'masterList') {
      // CREATION DE PATIENT
      // AJOUTER PATIENT
      this.addPatient(this.prenomVal, this.nomVal, this.secVal, this.mVal, this.fVal, this.villeVal,
        this.rueVal, this.numVal, this.etageVal, this.codeVal, this.naissVal, container.id);
    }
  }
// affichage du div ajout ajout patient
  afficher_div(){
    this.affichage_div = !this.affichage_div;

}
  logout(): void {
    console.log('Logout');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
