## Come generare le chiavi

Apri il terminale e incolla i comandi qui sotto. Per cambiare nome alla chiave, sostituisci "client-test-keypair" con il filename che vuoi dare alla chiave.

```
openssl genrsa -out client-test-keypair.rsa.pem 2048
openssl rsa -in client-test-keypair.rsa.pem -pubout -out client-test-keypair.rsa.pub
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in client-test-keypair.rsa.pem -out client-test-keypair.rsa.priv
```

## Come caricare le chiavi

1. Dopo aver generato la coppia di chiavi e averle riposte al sicuro, copia l’intero contenuto del file della chiave pubblica (quella che finisce in .pub); assicurati di includere anche le parti iniziale e finale (inizia con `-----BEGIN PUBLIC KEY-----` e finisce con `-----END PUBLIC KEY-----`);
2. torna sulla piattaforma;
3. all’interno della tab "Chiavi pubbliche" nel client di interesse, troverai un bottone "+ Aggiungi";
4. a quel punto, clicca su "Carica". Riceverai immediatamente riscontro se il caricamento sia andato a buon fine o meno. Se dovessero verificarsi errori, segui le istruzioni indicate nel messaggio di "feedback".
