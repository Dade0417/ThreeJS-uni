// AUTO SLIDER DA LINK NAVBAR A PAGINA
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// EFFETTO SCROLL NAVBAR
window.addEventListener("scroll", function(){
    const header = document.querySelector(".navbar");
    header.classList.toggle("sticky", window.scrollY > 0);
});

// JSON
fetch('threejs.json')
    .then(response => response.json())
    .then(data => {
        const jsonContainer = document.querySelector('#jsonContainer');
        
        let tableHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">${data.library}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Descrizione</td>
                            <td>${data.description}</td>
                        </tr>
                        <tr>
                            <td>Features</td>
                            <td>
                                <ul>
                                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>Utilizzi</td>
                            <td>
                                <ul>
                                    ${data.usage.map(use => `<li>${use}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>Risorse</td>
                            <td>
                                <ul>
                                    <li><a href="${data.resources.website}" target="_blank">Website</a></li>
                                    <li><a href="${data.resources.documentation}" target="_blank">Documentation</a></li>
                                    <li><a href="${data.resources.github}" target="_blank">GitHub</a></li>
                                    <li><a href="${data.resources.examples}" target="_blank">Examples</a></li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>Tutorial</td>
                            <td>
                                <ul>
                                    ${data.resources.tutorials.map(tutorial => `<li><a href="${tutorial.url}" target="_blank">${tutorial.title}</a></li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        jsonContainer.innerHTML = tableHTML;
    })
    .catch(error => console.error('Error fetching JSON:', error));


// CRUD
const listaPersone = document.getElementById("listaPersone");
const aggiungiBtn = document.getElementById('aggiungiBtn');
const modificaBtn = document.getElementById('modificaBtn');
const eliminaBtn = document.getElementById('eliminaBtn');
const selectPersona = document.getElementById('selectPersona');

function addOptionToSelect(nome, cognome) {
    const option = document.createElement("option");
    option.value = nome + "|" + cognome;
    option.textContent = nome + " " + cognome;
    selectPersona.appendChild(option);
}

function saveToLocalStorage() {
    const persone = [];
    listaPersone.querySelectorAll("div").forEach(div => {
        const [nome, cognome] = div.id.split("|");
        persone.push({nome, cognome});
    });
    localStorage.setItem("persone", JSON.stringify(persone));
}

function loadFromLocalStorage() {
    const storedPersone = JSON.parse(localStorage.getItem("persone"));
    if (storedPersone) {
        storedPersone.forEach(persona => {
            const newDiv = document.createElement("div");
            newDiv.id = persona.nome + "|" + persona.cognome;
            newDiv.textContent = persona.nome + " " + persona.cognome;
            listaPersone.appendChild(newDiv);
            addOptionToSelect(persona.nome, persona.cognome);
        });
    }
}

loadFromLocalStorage();

aggiungiBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const nomeAE = document.getElementById("nomeAE").value;
    const cognomeAE = document.getElementById("cognomeAE").value;
    if (nomeAE !== "" && cognomeAE !== "") {
        const newDiv = document.createElement("div");
        newDiv.id = nomeAE + "|" + cognomeAE;
        newDiv.textContent = nomeAE + " " + cognomeAE;
        listaPersone.appendChild(newDiv);
        addOptionToSelect(nomeAE, cognomeAE);
        saveToLocalStorage();
        document.getElementById("nomeAE").value = "";
        document.getElementById("cognomeAE").value = "";
    }
    else {
        alert("C'è qualcosa che non va con il nome e il cognome...");
    }
});

modificaBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedValue = selectPersona.value;
    const [vecchioNome, vecchioCognome] = selectedValue.split("|");
    const nuovoNome = document.getElementById("nomeM").value;
    const nuovoCognome = document.getElementById("cognomeM").value;
    if (nuovoNome !== "" && nuovoCognome !== "") {
        const divDaModificare = document.getElementById(vecchioNome + "|" + vecchioCognome);
        if (divDaModificare) {
            divDaModificare.id = nuovoNome + "|" + nuovoCognome;
            divDaModificare.textContent = nuovoNome + " " + nuovoCognome;
            const optionDaModificare = selectPersona.querySelector(`option[value="${selectedValue}"]`);
            if (optionDaModificare) {
                optionDaModificare.value = `${nuovoNome}|${nuovoCognome}`
                optionDaModificare.textContent = nuovoNome + " " + nuovoCognome;
            }
            saveToLocalStorage();
        }
    }
    else {
        alert("C'è qualche problema con la modifica del nome e/o cognome...");
    }
    document.getElementById("nomeM").value = "";
    document.getElementById("cognomeM").value = "";
});

eliminaBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const nomeAE = document.getElementById("nomeAE").value;
    const cognomeAE = document.getElementById("cognomeAE").value;
    const divDaEliminare = document.getElementById(nomeAE + "|" + cognomeAE);
    if (divDaEliminare) {
        listaPersone.removeChild(divDaEliminare);
        const optionDaEliminare = selectPersona.querySelector(`option[value="${nomeAE}|${cognomeAE}"]`);
        if (optionDaEliminare) {
            selectPersona.removeChild(optionDaEliminare);
        }
        saveToLocalStorage();
    }
    else {
        alert("Questa persona non è presente nella lista...");
    }
    document.getElementById("nomeAE").value = "";
    document.getElementById("cognomeAE").value = "";
});


