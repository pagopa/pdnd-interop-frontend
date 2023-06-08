---
name: Errore voucher
about: Stai cercando di ottenere un voucher e ricevi errore
title: ''
labels: voucher-errors

---

Per favore, compila quello che puoi dei campi seguenti. Ci aiuti ad assisterti più rapidamente.
NB: la tua client assertion è un'informazione sensibile: non inserirla all'interno di questa issue. Ogni richiesta contenente informazioni riservate o sensibili sarà rimossa senza preavviso dagli amministratori.

**Step di auto-debug**
Prima di aprire un issue, puoi effettuare le seguenti verifiche per escludere un errore di configurazione:
1. Se stai richiedendo un voucher per un e-service, il `purposeId` inserito è quello corretto?
2. il `client_id` inserito nella richiesta al server autorizzativo corrisponde al valore inserito come subject (campo `SUB`) nella client assertion?
3. la chiave privata con la quale è stata firmata la client assertion corrisponde alla pubblica (campo `KID`) depositata su PDND Interoperabilità?
4. la chiave con la quale firmi l'asserzione (campo `KID`) è inserita all'interno del client che hai indicato (campo `SUB`)?

**Il codice IPA del tuo ente**
Se non lo sai, lo trovi così: 
1. vai [qui](https://www.indicepa.gov.it/ipa-portale/consultazione/indirizzo-sede/ricerca-ente)
2. inserisci il nome del tuo ente e clicca "Ricerca"
3. sul risultato che ti interessa, clicca nella casella di "Ulteriori informazioni"
4. nella nuova pagina che si apre, sarà visibile il codice IPA di fianco al nome dell'ente

**Data e ora del tentativo**
es. 24/11/2021 h. 10:20

**Ambiente**
Produzione o Collaudo

**client_id**
Es. `3b0d583b-7d4c-4bcf-a27c-1d82e81fa321`

**correlationId**
Il campo che identifica la richiesta, viene restituito dal backend all'interno della risposta assieme all'errore. Es. `47508f4c-bc49-4d34-8adb-a85f734b45b9`

**purposeId (solo per i client e-service)**
È uno dei campi che hai inserito all'interno della client assertion. Es. `69fb9f60-bd47-4b4d-9652-9747f7953234`
