import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PatientInterface} from './dataInterfaces/patient';
import {Adresse} from './dataInterfaces/adresse';
import {InfirmierInterface} from './dataInterfaces/infirmier';

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {
  private http: HttpClient;
  private doc: any;

  constructor(_http: HttpClient) {
    this.http = _http;
  }

  getNode(root: Element, selector: string): string {
    if (root.querySelectorAll(selector).length > 0) {
      return root.querySelector(selector).textContent;
    } else {
      return null;
    }
  }

  // ADRESSE INTERFACE
  getAdresseFrom(root: Element): Adresse {
    return {
      ville: this.getNode(root, 'ville'),
      codePostal: +this.getNode(root, 'codePostal'),
      rue: this.getNode(root, 'rue'),
      numero: this.getNode(root, 'numéro'),
      etage: this.getNode(root, 'étage')
    };
  }

  // INFIRMIER INTERFACE
  getInfirmierFrom(root: Element): InfirmierInterface {
    return {
      id: root.getAttribute('id'),
      prenom: this.getNode(root, 'prénom'),
      nom: this.getNode(root, 'nom'),
      photo: this.getNode(root, 'photo'),
      patients: this.getPatientsArrayById(root.getAttribute('id')),
      adresse: this.getAdresseFrom(root)
    };
  }

  // PATIENT INTERFACE
  getPatientFrom(root: Element): PatientInterface {
    return {
      prenom: this.getNode(root, 'prénom'),
      nom: this.getNode(root, 'nom'),
      sexe: +this.getNode(root, 'sexe'),
      numeroSecuriteSociale: this.getNode(root, 'numéro'),
      adresse: this.getAdresseFrom(root.querySelector('adresse')),
      id: root.querySelector('visite').getAttribute('intervenant')
    };
  }

  // TOUS LES INFIRMIERS
  getInfirmiersArray(): any {
    if (this.doc !== undefined) {
      const tabInfirmier = this.doc.querySelector('cabinet').querySelectorAll('infirmiers > infirmier');
      const resTabInfirmiers = [];
      for (const infirmier of tabInfirmier) {
        console.log(infirmier);

        resTabInfirmiers.push(this.getInfirmierFrom(infirmier));
      }
      return resTabInfirmiers;
    }

    return null;

  }

  // LISTE DE TOUS LES PATIENTS
  getPatientsArray(): any {
    if (this.doc !== undefined) {
      const tabPatients = this.doc.querySelector('cabinet').querySelectorAll('patients > patient');
      const resTabPatients = [];
      for (const patient of tabPatients) {
        resTabPatients.push(this.getPatientFrom(patient));
      }
      return resTabPatients;
    }

    return null;
  }

  // LISTE DE PATIENTS QUI SONT AFFECTEES A INTERVENANT id
  getPatientsArrayById(id: string): any {
    if (this.doc !== undefined) {
      const tousPatients = this.getPatientsArray();
      const resTabPatients = [];
      for (const patient of tousPatients) {
        if (patient.id === id || id === null && patient.id === '') {
          resTabPatients.push(patient);
        }
      }
      return resTabPatients;
    }

    return null;
    console.log('NULL');
  }

  // RECHERCHER INFIRMIER
  getInfirmiersArrayById(id: string): any {
    const tabInfirmier = this.doc.querySelector('cabinet').querySelectorAll('infirmiers > infirmier');
    const resTabInfirmiers: InfirmierInterface[] = new Array(tabInfirmier.length);
    for (const infirmier of tabInfirmier) {
      if (infirmier.getAttribute('id') === id) {
        resTabInfirmiers.push(this.getInfirmierFrom(infirmier));
      }
    }
    return resTabInfirmiers;
  }

  getArrayAVisterByInfirmierId(id: string): any {
    const tabAvisiter = this.getInfirmiersArrayById(id);
    return tabAvisiter.concat(this.getPatientsArrayById(id));
  }

  async getData(url: string) {
    const response = await this.http.get(url, {responseType: 'text'}).toPromise();
    const parser = new DOMParser();
    this.doc = parser.parseFromString(response, 'application/xml');
    console.log(this.getInfirmiersArray());

    return {
      infirmiers: this.getInfirmiersArray(),
      patientsNonAffectes: this.getPatientsArrayById(null),
      adresse: this.getAdresseFrom(this.doc)
    };

  }

  // POST UTILISEE POUR AJOUTER NOUVEAU PATIENT
  postAdd(prenom: string, nom: string, nss: string, M: boolean, F: boolean,
          ville: string, rue: string, numero: string, etage: string, cp: string, date: string) {
    alert('Patient ajoutee');
    this.http.post('/addPatient', {
      patientName: nom,
      patientForname: prenom,
      patientNumber: nss,
      patientSex: (M) ? 'M' : 'F',
      patientBirthday: date,
      patientFloor: etage,
      patientStreetNumber: numero,
      patientStreet: rue,
      patientPostalCode: cp,
      patientCity: ville
    }).subscribe();
  }

  // POST UTILISEE POUR MODIFIER PATIENT EXISTANT
  postAffectation(infirmier: string, patient: string) {
    alert('Patient modifiee');
    console.log('DROP modification: ' + infirmier + ' | ' + patient);
    this.http.post('/affectation', {
      infirmier: infirmier,
      patient: patient
    }).subscribe();
  }

  // "POST" QUI EST ENSEMBLE DE ADD + AFFECTATION - CAS NOUVEAU PATIENT -> INFIRMIER
  postCreate(prenom: string, nom: string, nss: string, M: boolean, F: boolean,
             ville: string, rue: string, numero: string, etage: string, cp: string, date: string, infirmier: string) {
    // AJOUTER PATIENT
    this.http.post('/addPatient', {
      patientName: nom,
      patientForname: prenom,
      patientNumber: nss,
      patientSex: (M) ? 'M' : 'F',
      patientBirthday: date,
      patientFloor: etage,
      patientStreetNumber: numero,
      patientStreet: rue,
      patientPostalCode: cp,
      patientCity: ville
    }).subscribe();
    // MODIFIER
    alert('Patient cree');
    this.http.post('/affectation', {
      infirmier: infirmier,
      patient: nss
    }).subscribe();
  }
}
