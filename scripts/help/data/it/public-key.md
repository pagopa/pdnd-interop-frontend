## Come generare le chiavi

Apri il terminale e incolla i comandi qui sotto. Per cambiare nome alla chiave, sostituisci "client-test-keypair" con il filename che vuoi dare alla chiave.

```
openssl genrsa -out client-test-keypair.rsa.pem 2048
openssl rsa -in client-test-keypair.rsa.pem -pubout -out client-test-keypair.rsa.pub
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in
client-test-keypair.rsa.pem -out client-test-keypair.rsa.priv
```

## Come caricare le chiavi

1. Dopo aver generato la coppia di chiavi e averle riposte al sicuro, copia il contenuto del file della chiave pubblica (finisce in “.pub”, e il cui file inizia con "`-----BEGIN PUBLIC KEY-----`");
2. copia questo contenuto e torna sulla piattaforma;
3. all’interno della tua utenza, troverai un bottone “carica nuova chiave”;
4. seleziona il tipo di algoritmo di criptazione utilizzato, e incolla la chiave nel campo di testo;
5. a quel punto, clicca su “carica chiave”. Riceverai immediatamente riscontro se il caricamento sia andato a buon fine o meno. Se dovessero verificarsi errori, segui le istruzioni indicate nel messaggio di errore.
