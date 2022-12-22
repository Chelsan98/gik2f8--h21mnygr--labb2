
todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
/* En annan eventtyp som kan användas för att fånga tangenttryck är "input". De fungerar lite olika, men tillräckligt lika för vårt syfte. Kolla gärna själva upp skillnader.  */
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

/* I dueDate måste man fånga upp input, då man kan förändra fältet genom att välja datum i en datumväljare, och således aldrig faktiskt skriva i fältet.  */
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

/* Formuläret har eventtypen"submit", som triggas när någon trycker på en knapp av typen "submit". Som denna: 
<button name="submitTodoForm" class="rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1" type="submit"> */

/* Så istället för att lyssna efter "click"-event hos knappen, lyssnar man istället efter formulärets "submit"-event som kan triggas av just denna knapp just för att den har typen submit. */
todoForm.addEventListener('submit', onSubmit);

/* Här hämtas list-elementet upp ur HTML-koden. Alltså det element som vi ska skriva ut listelement innehållande varje enskild uppgift i. */
const todoListElement = document.getElementById('todoList');
/* Jag använder oftast getElementById, men andra sätt är att t.ex. använda querySelector och skicka in en css-selektor. I detta fall skulle man kunna skriva document.querySelector("#todoList"), eftersom # i css hittar specifika id:n. Ett annat sätt vore att använda elementet document.querySelector("ul"), men det är lite osäkert då det kan finnas flera ul-element på sidan. Det går också bra att hämta på klassnamn document.querySelector(".todoList") om det hade funnits ett element med sådan klass (det gör det inte). Klasser är inte unika så samma kan finnas hos flera olika element och om man vill hämta just flera element är det vanligt att söka efter dem via ett klassnamn. Det man behöver veta då är att querySelector endast kommer att innehålla ett enda element, även om det finns flera. Om man vill hitta flera element med en viss klass bör man istället använda querySelectorAll.  */

/* Här anges startvärde för tre stycken variabler som ska användas vid validering av formulär. P.g.a. lite problem som bl.a. har med liveServer att göra, men också att formuläret inte rensas har dessa satts till true från början, även om det inte blir helt rätt. Dessa ska i alla fall tala om för applikationen om de olika fälten i formulären har fått godkänd input.  */
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;


const api = new Api('http://localhost:5000/tasks');


function validateField(field) {
  
  const { name, value } = field;

  /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
  let = validationMessage = '';
  /* En switchsats används för att kolla name, som kommer att vara title om någon skrivit i eller lämnat titlefältet, annars description eller date.   */
  switch (name) {
    /* Så de olika fallen - case - beror på vilket name-attribut som finns på det elementet som skickades till validateField - alltså vilket fält som någon skrev i eller lämnade. */

    /* Fallet om någon skrev i eller lämnade fältet med name "title" */
    case 'title': {
      /* Då görs en enkel validering på om värdet i title-fältet är kortare än 2 */
      if (value.length < 2) {
        /* Om det inte är två tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, validationMessage sätts till ett lämpligt meddelande som förklarar vad som är fel.  */
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        /* Validering görs också för att kontrollera att texten i fältet inte har fler än 100 tecken. */
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        /* Om ingen av dessa if-satser körs betyder det att fältet är korrekt ifyllt. */
        titleValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "description" */
    case 'description': {
      /* Liknande enkla validering som hos title */
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "dueDate" */
    case 'dueDate': {
      /* Här är valideringen att man kollar om något alls har angetts i fältet. dueDate är obligatoriskt därför måste det vara mer än 0 tecken i fältet */
      if (value.length === 0) {
        /* I videon för lektion 6 är nedanstående rad fel, det står där descriptionValid =  false;, men ska förstås vara dueDateValid = false; */
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;
  /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
  field.previousElementSibling.classList.remove('hidden');
}

/* Callbackfunktion som används för eventlyssnare när någon klickar på knappen av typen submit */
function onSubmit(e) {
  /* Standardbeteendet hos ett formulär är att göra så att webbsidan laddas om när submit-eventet triggas. I denna applikation vill vi fortsätta att köra JavaScript-kod för att behandla formulärets innehåll och om webbsidan skulle ladda om i detta skede skulle det inte gå.   */

  /* Då kan man använda eventets metod preventDefault för att förhindra eventets standardbeteende, där submit-eventets standardbeteende är att ladda om webbsidan.  */
  e.preventDefault();
  /* Ytterligare en koll görs om alla fält är godkända, ifall man varken skrivit i eller lämnat något fält. */
  if (titleValid && descriptionValid && dueDateValid) {
    /* Log för att se om man kommit förbi valideringen */
    console.log('Submit');

    /* Anrop till funktion som har hand om att skicka uppgift till api:et */
    saveTask();
  }
}

/* Funktion för att ta hand om formulärets data och skicka det till api-klassen. */
function saveTask() {
  /* Ett objekt vid namn task byggs ihop med hjälp av formulärets innehåll */
  /* Eftersom vi kan komma åt fältet via dess namn - todoForm - och alla formulärets fält med dess namn - t.ex. title - kan vi använda detta för att sätta värden hos ett objekt. Alla input-fält har sitt innehåll lagrat i en egenskap vid namn value (som också används i validateField-funktionen, men där har egenskapen value "destrukturerats" till en egen variabel. ) */
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };
  

  api.create(task).then((task) => {
    /* Task kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet "task".  */
    if (task) {
      /* När en kontroll har gjorts om task ens finns - dvs. att det som kom tillbaka från servern faktiskt var ett objekt kan vi anropa renderList(), som ansvarar för att uppdatera vår todo-lista. renderList kommer alltså att köras först när vi vet att det gått bra att spara ner den nya uppgiften.  */
      renderList();
    }
  });
}

/* En funktion som ansvarar för att skriva ut todo-listan i ett ul-element. */
function renderList() {
  /* Logg som visar att vi hamnat i render-funktionen */
  console.log('rendering');

  /* Anrop till getAll hos vårt api-objekt. Metoden skapades i Api.js och har hand om READ-förfrågningar mot vårt backend. */
  api.getAll().then((tasks) => {
    
    todoListElement.innerHTML = '';

    /* De hämtade uppgifterna från servern via api:et getAll-funktion får heta tasks, eftersom callbackfunktionen som skickades till then() har en parameter som är döpt så. Det är tasks-parametern som är innehållet i promiset. */

    /* Koll om det finns någonting i tasks och om det är en array med längd större än 0 */
    if (tasks && tasks.length > 0) {
      // Gör strängen med date infon till date så man kan räkna på den och sortera efter vad som är lägst.
      tasks.sort(function(a,b){return new Date (a.dueDate) - new Date (b.dueDate)});
      tasks.sort(function(x, y) {
        
        // sorterar på bool och falsk kommer först här. Att uppgiften inte är klar.
        return (x.completed === y.completed)? 0 : x.completed? 1 : -1;
    });
      
      /* Om tasks är en lista som har längd större än 0 loopas den igenom med forEach. forEach tar, likt then, en callbackfunktion. Callbackfunktionen tar emot namnet på varje enskilt element i arrayen, som i detta fall är ett objekt innehållande en uppgift.  */
      tasks.forEach((task) => {
       
        /* Denna kod körs alltså en gång per element i arrayen tasks, dvs. en  gång för varje uppgiftsobjekt i listan. */
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}

/* renderTask är en funktion som returnerar HTML baserat på egenskaper i ett uppgiftsobjekt. 
Endast en uppgift åt gången kommer att skickas in här, eftersom den anropas inuti en forEach-loop, där uppgifterna loopas igenom i tur och ordning.  */

/* Destructuring används för att endast plocka ut vissa egenskaper hos uppgifts-objektet. Det hade kunnat stå function renderTask(task) {...} här - för det är en hel task som skickas in - men då hade man behövt skriva task.id, task.title osv. på alla ställen där man ville använda dem. Ett trick är alltså att "bryta ut" dessa egenskaper direkt i funktionsdeklarationen istället. Så en hel task skickas in när funktionen anropas uppe i todoListElement.insertAdjacentHTML("beforeend", renderTask(task)), men endast vissa egenskaper ur det task-objektet tas emot här i funktionsdeklarationen. */
function renderTask({ id, title, description, dueDate, completed }) {
  // La till completed så man kan komma åt det och välja vad som ska renderas med unika styles. 
let html = ``
if(!completed){
  html = `
  <li class="select-none mt-2 py-2 border-b border-amber-300">
    <div class="flex items-center">
      <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
      <div>
        <span>${dueDate}</span>
        <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
      </div>
    </div>`;

description &&
  
  (html += `
    <p class="ml-8 mt-2 text-xs italic">${description}</p>
`);

html += `
  
  <input type="checkbox" id=${id} onclick="updateOnChange(this)" >
  <label class=" mt-2 text-xs italic">Markera som klar</label>
  </li>`;
}
else{
  html = `
  <li class="select-none mt-2 py-2 border-b border-amber-300">
    <div class="flex items-center">
      <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase text-green-700">${title}</h3>
      <div>
        <span>${dueDate}</span>
        <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
      </div>
    </div>`;
description &&
  
  (html += `
    <p class="ml-8 mt-2 text-xs italic">${description}</p>
`);

html += `
  <input type="checkbox" input checked id=${id} onclick="updateOnChange(this)" >
  <label class=" mt-2 text-xs italic text-green-700">Klar</label>
  </li>`;
}
  
  
  return html;
}

/* Funktion för att ta bort uppgift. Denna funktion är kopplad som eventlyssnare i HTML-koden som genereras i renderTask */
function deleteTask(id) {
  /* Det id som skickas med till deleteTask är taget från respektive uppgift. Eftersom renderTask körs en gång för varje uppgift, och varje gång innehåller en unik egenskap och dess uppgifter, kommer också ett unikt id vara kopplat till respektive uppgift i HTML-listan. Det är det id:t som skickas in hit till deleteTasks. */

  /* Api-klassen har en metod, remove, som sköter DELETE-anrop mot vårt egna backend */
  api.remove(id).then((result) => {
    /* När REMOVE-förfrågan är skickad till backend via vår Api-klass och ett svar från servern har kommit, kan vi på nytt anropa renderList för att uppdatera listan. Detta är alltså samma förfarande som när man skapat en ny uppgift - när servern är färdig uppdateras listan så att aktuell information visas. */

    renderList();
    /* Notera att parametern result används aldrig i denna funktion. Vi skickar inte tillbaka någon data från servern vid DELETE-förfrågningar, men denna funktion körs när hela anropet är färdigt så det är fortfarande ett bra ställe att rendera om listan, eftersom vi här i callbackfunktionen till then() vet att den asynkrona funktionen remove har körts färdigt. */
  });
}

/***********************Labb 2 ***********************/

async function updateOnChange(update){
  // Använde en debugger för att leta rätt på var exakt saker låg i förhållande till checkboxen.
  const task = update.parentElement;
  var description=task.childNodes[3].innerText;
  const title = task.childNodes[1].childNodes[1].innerText;
  const id = parseInt(task.id);
  const dueDate = task.childNodes[1].childNodes[3].childNodes[1].innerText;
  // Gammal kod för att kunna kolla på en del av processen.

  //const dueDate = task.parentElement.innerText;
  // var taskDone = document.getElementById()
  // taskDone.addEventListener("change", (event)=>{
  //  if(event.currentTarget.checked){
  //     taskUpdate = {
  //     title: todoForm.title.value,
  //     description: todoForm.description.value,
  //     dueDate: todoForm.dueDate.value,
  //     completed: true
  //   };
  let taskData = {
    id: update.id,
    title: title,
    description: description,
    dueDate: dueDate,
    completed: update.checked
  };

  //update.parentElement.style.color ="green";
     
   //}
    // else{
    //     taskUpdate = {
    //     title: todoForm.title.value,
    //     description: todoForm.description.value,
    //     dueDate: todoForm.dueDate.value,
    //     completed: false
    //   };
    //   taskDone.parentElement.style.color ="black";
       
    // }
    
  api.update(taskData).then(() => renderList());  
 // }
  //)
  
};

renderList();
