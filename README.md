# Projet 'Cabinet médical'


![](https://students.uu.nl/sites/default/files/styles/image_385x257/public/geo-exchange-fr-grenoble-logo.png?itok=8bWbdA6s&timestamp=1488291904)



## IMPORTANTE
**login:** admin

**pass:** admin123


## Introduction
Développé dans le cadre d'études en UGA, ce projet sert à démontrer nos compétences en programmation Angular et en compréhension des concepts de base de l'architecture logicielle.

## Probleme
Notre cas d'étude consistait à créer une interface pour un système de gestion de clinique, dans lequel une personne (secrétaire) pouvait interagir avec BD du serveur de la clinique en créant ou en modifiant des profils de patients existants. 

On nous a donné l'application serveur, le format du BD ```.xml```et les fonctions de communication avec le serveur (```POST``` et ```GET```).

## Processus de développement
Nous avons commencé par écrire des méthodes de traitement qui récupéraient et traitaient les données du serveur, puis les stockions dans une interface de données prédéfinie -```CabinetInterface```. Toutes ces fonctions font partie de la classe **CabinetMedicalService** et sont ensuite appelées par d'autres parties de notre application.

Une fois que **CabinetMedicalService** a été testé, nous avons migré vers **secretary.component**, qui est au cœur de notre application. Elle appelle les fonctions **CabinetMedicalService** pour extraire les données du serveur, les visualise à l’aide de **patient.component** et **infirmier.component**, gère les manipulation locale des données, puis appelle les fonctions de **CabinetMedicalService** pour communiquer avec le serveur afin de mettre à jour son BD.

Pendant tout ce temps, nous nous sommes concentrés uniquement sur la partie technique avec des composants material simples. Ce n’est que lorsque tout a été fait et testé que nous avons décidé de créer un design visuellement attrayant.

## secretary.component
Le code à l'intérieur de **CabinetMedicalService** est générique et ne sera discuté que brièvement ici. Au lieu de cela, nous allons passer directement à la façon dont nous avons géré notre interface dans **secretary.component**.

Pour résoudre le problème de la secrétaire, nous avons décidé de créer un design intuitif et simple à utiliser. Pour cela, comme recommandé par le [document de projet](https://docs.google.com/document/d/1uQQOcugnp6A-rB41JC9M3HmNGxC3DKk5JNshOdhS5DE/edit#heading=h.blaviy7tix1), nous avons utilisé des composants **Drag and Drop** (plus sur eux plus tard).

La fenêtre de secrétaire se compose de deux sections principales: infirmiers et patients non affectés.
* La section Infirmiers contient un conteneur pour chaque infirmier avec son identifiant (photo, nom, prénom) et sa liste de patients.
![](https://i.imgur.com/ov9wHxb.png)
* L'autre section contient simplement la liste des patients qui doivent être placés sous un médecin.
![](https://i.imgur.com/mBbqG3t.png)

Pour créer un nouveau patient, la secrétaire doit cliquer sur le bouton "Ajouter un patient". Ensuite, un champ apparaîtra dans la section infirmier où il devra saisir les données personnelles.
![](https://i.imgur.com/LZ9wJyq.png)



Pour sauvegarder les données du patient, secretaire doit simplement faire glisser la carte dans la colonne de son choix. Contrairement à ce qui est proposé dans le sujet, nous lui avons permis de sauvegarder directement sous un infimier en créant une méthode qui utilise ```POST``` enchaînée ```/addPatient -> /affectation```.

Pour éditer les données des patients existants, il lui suffit simplement de faire glisser la carte.

![](https://i.imgur.com/kiNoJqI.gif)

## Mise à jour de la base de données

Une fois le ```POST``` appelé, le côté serveur est mis à jour et le client (secrétaire) obtient un message de type alerte. Normalement, il devrait mettre à jour sa page pour voir les modifications. Pour remédier à ce problème, nous mettons également à jour la base de données locale (**CabinetInterface**).

Malheureusement, notre système a un petit défaut: au cas où le serveur obtiendrait une erreur ET ne mettrait pas à jour sa base de données, la page locale resterait comme si tout se passait bien. Pour éviter cela, nous pouvions techniquement capturer la réponse du serveur (```200```/```400```) et traiter ensuite la base de données locale, mais nous ne l'avons pas couverte dans notre projet.

## cdkDragDrop drop événements
Chose intéressant que nous avons rencontrée au cours du développement est la gestion des événements ```drop``` dans l'application.

Etant donné que les éléments pour la liste d’infirmiers et les patients non affectés sont générés dans des composants séparés, les événements ```drop``` sont gérés dans leurs ```.ts```

Ainsi, pour notifier le **secretary.component**, nous devions créer ```Emmiter``` à l'intérieur de ces composants enfants qui ```emit``` et appel la fonction ```editPatient(event: any[])```, quelle gére toute la logique.

## Regard rétrospectif sur notre projet
En regardant ce que nous avons fait, nous avons le sentiment que nous pourrions mieux répartir les fonctionnalités entre les composants. Mais cela ne fait que valider l’importance d’une bonne architecture dans tout développement logiciel.

### Coulibaly Kadidiatou
### Firsov Oleksandr
