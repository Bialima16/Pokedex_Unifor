var listOfPokemon = []; //alteração aqui // lista de pokémons //A
var filteredListOfPokemon = []; // alteração aqui // lista filtrada de pokémons // B
var currentPage = 1; //alteração aqui // página atual // C
var itensPerPage = 20; //alteração aqui // número de itens por página // D
var searchByNameOrID = ''; // alteração aqui // busca por nome ou ID // E
var typeFilter = ''; //alteração aqui// filtro de tipo // F1
var clearAndAddPokémonCards = null; // alteração aqui // função para limpar e adicionar cards de pokémons // G

const APIPokemon = 'https://pokeapi.co/api/v2/pokemon'; //alteração aqui // API de pokémons 
const APIType = 'https://pokeapi.co/api/v2/type'; //alteração aqui // API de tipos 

async function startPage() { //alteração aqui // inicia a página
    document.getElementById('loading').innerHTML = '';
    for(var i = 0; i < itensPerPage; i++) { //alteração aqui
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }
    
    try {
        var requestInformation = await fetch(API2); //alteração aqui // busca informações da API de tipos
        var pokémonInformation = await requestInformation.json();//alteração aqui // converte para JSON
        var selectType = document.getElementById('typeFilter'); //alteração aqui  // seleciona o elemento de filtro de tipo
        for(var i = 0; i < pokémonInformation.results.length; i++) {//alteração aqui 
            var option = document.createElement('option');//alteração aqui
            option.value = pokémonInformation.results[i].name;//alteração aqui
            option.textContent = pokémonInformation.results[i].name.charAt(0).toUpperCase() + pokémonInformation.results[i].name.slice(1);//alteração aqui
            selectType.appendChild(option); //alteração aqui
        }
    } catch(error) { //alteração aqui
        console.log('erro');
    }
    
    loadListOfPokemon(); //alteração aqui
}

async function loadListOfPokemon() { //alteração aqui // carrega a lista de pokémons
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';
    
    try {
        var off = (currentPage - 1) * itensPerPage; //alteração aqui
        var ur = APIPokemon + '?limit=' + itensPerPage + '&offset=' + off; //alteração aqui
        var r = await fetch(ur);
        var dt = await r.json();
        
        var pro = [];
        for(var i = 0; i < dt.results.length; i++) {
            pro.push(fetch(dt.results[i].url));
        }
        
        var r = await Promise.all(pro);
        listOfPokemon = []; //alteração aqui // lista de pokémons
        for(var i = 0; i < r.length; i++) {
            var pokemon = await r[i].json();
            listOfPokemon.push(pokemon); //alteração aqui 
        }
        
        filteredListOfPokemon = [...listOfPokemon]; //alteração aqui
        RenderPokemonCards(); // alteração aqui
    } catch(error) {
        console.log('erro ao carregar');
        alert('Erro ao carregar Pokémons!');
    }
}

async function listOfPokemonByType() { //alteração aqui // lista de pokémons por tipo
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        var typeUrl = API2 + '/' + typeFilter; //alteração aqui//monta a URL da API
        var response = await fetch(typeUrl);//Resposta "Crua" da variável url
        var typeData = await response.json();//Converte a resposta de response para JSON

        var pokemonRequests = []; //Lista de Promises(Requisições pendentes)
        var pokemonLimitPerType = typeData.pokemon.length > 100 ? 100 : typeData.pokemon.length; // alteração aqui //para limitar a 100 pokémons por tipo
        for(var i = 0; i < pokemonLimitPerType; i++) { //alteração aqui
            pokemonRequests.push(fetch(typeData.pokemon[i].pokemon.url));
        }

        var pokemonResponses = await Promise.all(pokemonRequests);//Uma lista contendo as respostas de cada pokémon individual 
        listOfPokemon = []; //alteração aqui // A lista principal com todos os pokémons carregados completos
        for(var i = 0; i < pokemonResponses.length; i++) {
            var pokemonData = await pokemonResponsess[i].json();//pokemon individual em formato JSON
            listOfPokemon.push(pokemonData); //alteração aqui
        }

        filteredListOfPokemon = [...listOfPokemon]; //alteração aqui// Uma cópia da lista principal, usada para ser filtrada
        RenderPokemonCards(); //alteração aqui
    } catch(error) {//caso aconteça algum erro durante o processo
        console.log('erro ao carregar tipo');
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function RenderPokemonCards() { //alteração aqui // renderiza os cards de pokémons
    var clearAndAddPokémonCards = document.getElementById('pokemonGrid'); // alteração aqui
    clearAndAddPokémonCards.innerHTML = ''; // alteração aqui

    var listFilter = filteredListOfPokemon; // alteração aqui
    if(searchByNameOrID !== '') { // alteração aqui
        listFilter = listFilter.filter(pokemon => { // alteração aqui
            return pokemon.name.toLowerCase().includes(searchByNameOrID.toLowerCase()) || // alteração aqui
                   pokemon.id.toString().includes(searchByNameOrID); // alteração aqui
        });
    }

    for(var i = 0; i < listFilter.length; i++) { // alteração aqui
        var p = listFilter[i]; // alteração aqui
        var card = document.createElement('div'); // alteração aqui
        card.className = 'col-md-3'; // alteração aqui
        
        var html = '<div class="c" onclick="showDetails(' + p.id + ')">';
        html = html + '<img src="' + p.sprites.front_default + '" class="i" alt="' + p.name + '">';
        html = html + '<h5 class="text-center">#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';
        
        for(var j = 0; j < p.types.length; j++) {
            var typeName = p.types[j].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }
        
        html = html + '</div></div>';
        card.innerHTML = html; // alteração aqui
        clearAndAddPokémonCards.appendChild(card); // alteração aqui
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(typeFilter !== '') { //alteração aqui
        document.getElementById('pageInfo').textContent = 'Mostrando ' + listFilter.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + currentPage; //alteração aqui
    }

    document.getElementById('prevBtn').disabled = currentPage === 1 || typeFilter !== ''; //alteração aqui
    document.getElementById('nextBtn').disabled = typeFilter !== ''; //alteração aqui
}

async function f() {
    searchByNameOrID = document.getElementById('s').value; // alteração aqui
    typeFilter = document.getElementById('typeFilter').value; //alteração aqui

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(typeFilter !== '') { //alteração aqui
        await listOfPokemonByType(); //alteração aqui
    } else {
        RenderPokemonCards();//alteração aqui
    }
}

function r() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    searchByNameOrID = ''; // alteração aqui
    typeFilter = ''; //alteração aqui
    currentPage = 1; // alteração aqui
    loadListOfPokemon(); //alteração aqui
}

function p1() {
    if(currentPage > 1) { //alteração aqui
        currentPage--; //alteração aqui
        if(typeFilter !== '') { // alteração aqui
            RenderPokemonCards();
        } else {
            loadListOfPokemon(); //alteração aqui
        }
    }
}

function p2() {
    currentPage++; //alteração aqui
    if(typeFilter !== '') { //alteração aqui
        RenderPokemonCards();
    } else {
        loadListOfPokemon(); //alteração aqui
    }
}

function pageTheme() { //alteração aqui // tema da página
    document.body.classList.toggle('dark');
}

async function Minhe_nha(id) {
    try {
        var xpto = await fetch(API + '/' + id);
        var p = await xpto.json();
        
        var zyz = await fetch(p.species.url);
        var m = await zyz.json();
        
        var desc = '';
        for(var i = 0; i < m.flavor_text_entries.length; i++) {
            if(m.flavor_text_entries[i].language.name === 'en') {
                desc = m.flavor_text_entries[i].flavor_text;
                break;
            }
        }
        
        document.getElementById('modalTitle').textContent = '#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1);
        
        var ph = '<div class="row"><div class="col-md-6">';
        ph += '<div class="sprite-container">';
        ph += '<div><img src="' + p.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        ph += '<div><img src="' + p.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        ph += '</div>';
        
        ph += '<p><strong>Tipo:</strong> ';
        for(var i = 0; i < p.types.length; i++) {
            ph += '<span class="badge type-' + p.types[i].type.name + '">' + p.types[i].type.name + '</span> ';
        }
        ph += '</p>';
        
        ph += '<p><strong>Altura:</strong> ' + (p.height / 10) + ' m</p>';
        ph += '<p><strong>Peso:</strong> ' + (p.weight / 10) + ' kg</p>';
        
        ph += '<p><strong>Habilidades:</strong> ';
        for(var i = 0; i < p.abilities.length; i++) {
            ph += p.abilities[i].ability.name;
            if(i < p.abilities.length - 1) ph += ', ';
        }
        ph += '</p>';
        
        ph += '</div><div class="col-md-6">';
        
        ph += '<p><strong>Descrição:</strong></p>';
        ph += '<p>' + desc.replace(/\f/g, ' ') + '</p>';
        
        ph += '<h6>Estatísticas:</h6>';
        for(var i = 0; i < p.stats.length; i++) {
            var stat = p.stats[i];
            var percentage = (stat.base_stat / 255) * 100;
            ph += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            ph += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }
        
        ph += '</div></div>';
        
        document.getElementById('modalBody').innerHTML = ph;
        
        var mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();
        
    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

function mor() {
    var x = 10;
    var y = 20;
    return x + y;
}

var gmord = 'teste miqueias';

window.onload = function() {
    startPage();
};
