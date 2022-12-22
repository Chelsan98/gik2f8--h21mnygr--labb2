class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = '';

  /* När en instans av klassen skapas skickas url in som parametern */
  constructor(url) {
    /* Medlemsvariabeln url sätts till den sträng som man skickar in när man skapar en instans av klassen (det görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */
  create(data) {
    /* Konverterar inskickat JavaScriptobjekt, i detta fall är det en uppgift, till en sträng så att den kan skickas över HTTP. */
    const JSONData = JSON.stringify(data);
    /* Utskrift till logg för att se vad som ska skickas och vart det ska skickas */
    console.log(`Sending ${JSONData} to ${this.url}`);

    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
        /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
        /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  /* Read - GET */
  getAll() {
    /* I detta fetch-anrop behövs inga särskilda inställningar. Fetch kan ta bara url:en som parameter också, istället för att man skapar ett helt request-objekt och skickar in det. */
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  /* Delete = DELETE. Här heter dock metoden som hanterar DELETE-förfrågan "remove". delete får inte användas som metod- funktions- eller variabelnamn i JavaScript, då det är ett ord reserverat av JavaScript-språket självt.  */
  remove(id) {
    
    console.log(`Removing task with id ${id}`);

    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  
  async update(data) {
    // put funktionen som tar hand om json requests.
    const request = new Request('http://localhost:5000/tasks', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    //debugger;
    const finished = await fetch(request);
    return finished;
  }
  
}
