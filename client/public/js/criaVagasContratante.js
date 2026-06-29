let input = document.querySelector(".campoSugestoes");
let ul = document.querySelector(".listaDeSugestoes");
let contentEscolhidos = document.querySelector(".contentEscolhidos");
let listaDeCompetenciasEscolhidas = document.querySelector(".listaDeCompetenciasEscolhidas");
let listaCompetencia = [];

// Pega todos os dados do arquivo json e joga dentro do array "listaCompetencia";
fetch('/data/lista_cargos.json').then((response) => {
    response.json().then((lista_cargos) => {
        lista_cargos.competencias.map((competencia) => {
            listaCompetencia.push(competencia);
        });
    });
});

input.addEventListener("input", () => {
    let termo = input.value.toLowerCase();
    ul.innerHTML = "";

    if(termo.length === 0) {
        ul.style.display = "none";
        return;
    }

    let filtro = listaCompetencia.filter(item => {
        return item.toLowerCase().includes(termo);
    });

    if(filtro.length > 0) {
        filtro.forEach(item => {
            let li = document.createElement("li");
            li.classList.add("listaVaga");
            li.textContent = item;
            li.addEventListener("click", () => {
                input.value = "";
                ul.style.display = "none";
                contentEscolhidos.style.display = "block";
                let itemEscolhido = document.createElement("li");
                itemEscolhido.classList.add("itemEscolhido");
                itemEscolhido.value = item;
                itemEscolhido.textContent = item;
                listaDeCompetenciasEscolhidas.appendChild(itemEscolhido);
                
                itemEscolhido.addEventListener("click", () => {
                    itemEscolhido.remove();
                })
            });
            ul.appendChild(li);
        });
        ul.style.display = "block";
    } else {
        ul.style.display = "none";
    }
});

document.addEventListener("click", (event) => {
    if(event.target !== input) {
        ul.style.display = "none";
    }
});

//Adiciona ou retira uma classe do input quando o botão é clicado;
function adicionarCompetencia() {
    let div = document.querySelector(".campoCompetencia");
    div.classList.toggle("active");
}