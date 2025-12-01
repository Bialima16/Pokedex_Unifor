var listOfPokemon = []; //alteração aqui // lista de pokémons //A
var filteredListOfPokemon = []; // alteração aqui // lista filtrada de pokémons // B
var currentPage = 1; //alteração aqui // página atual // C
var itensPerPage = 20; //alteração aqui // número de itens por página // D
var searchByNameOrID = ''; // alteração aqui // busca por nome ou ID // E
var typeFilter = ''; //alteração aqui// filtro de tipo // F1
var clearAndAddPokémonCards = null; // alteração aqui // função para limpar e adicionar cards de pokémons // G

const homePage = 1; // alteração aqui // página inicial
const percentageConverter = 100; // alteração aqui // conversão para porcentagem 
const maxPokemonPerType = 100; // alteração aqui // número máximo de pokémons por tipo // F2
const deciConversion = 10; // alteração aqui // conversão decimal // 
const statMaxValue = 255; // alteração aqui // valor máximo de estatísticas // 
const APIPokemon = 'https://pokeapi.co/api/v2/pokemon'; //alteração aqui // API de pokémons 
const APIType = 'https://pokeapi.co/api/v2/type'; //alteração aqui // API de tipos 

async function startPage() { //alteração aqui // inicia a página
    document.getElementById('loading').innerHTML = '';
    for(var i = 0; i < itensPerPage; i++) { //alteração aqui
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }
    
    try {
        var requestInformation = await fetch(APIType); //alteração aqui // busca informações da API de tipos
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
        var ignorePokemon = (currentPage - homePage) * itensPerPage; //alteração aqui // ignorar pokémons 
        var searchForPokemonByPages = APIPokemon + '?limit=' + itensPerPage + '&offset=' + ignorePokemon; //alteração aqui // busca pokémons por página
        var searchForPokemonInformantionByPages = await fetch(searchForPokemonByPages); //alteração aqui 
        var saveThePageData = await searchForPokemonInformantionByPages.json(); //alteração aqui // salvar os dados da página
        
        var listPage = []; //alteração aqui // lista da páginagt
        for(var i = 0; i < saveThePageData.results.length; i++) { //alteração aqui
            listPage.push(fetch(saveThePageData.results[i].url)); //alteração aqui
        }
        
        var saveThePagesSearchResults = await Promise.all(listPage); //alteração aqui // Salvar os resultados da busca da página
        listOfPokemon = []; //alteração aqui // lista de pokémons
        for(var i = 0; i < saveThePagesSearchResults.length; i++) { //alteração aqui
            var pokemon = await saveThePagesSearchResults[i].json(); //alteração aqui
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
        var typeUrl = APIType + '/' + typeFilter; //alteração aqui//monta a URL da API
        var response = await fetch(typeUrl);//Resposta "Crua" da variável url
        var typeData = await response.json();//Converte a resposta de response para JSON

        var pokemonRequests = []; //Lista de Promises(Requisições pendentes)
        var pokemonLimitPerType = typeData.pokemon.length > maxPokemonPerType ? maxPokemonPerType : typeData.pokemon.length; // alteração aqui //para limitar a 100 pokémons por tipo
        for(var i = 0; i < pokemonLimitPerType; i++) { //alteração aqui
            pokemonRequests.push(fetch(typeData.pokemon[i].pokemon.url));
        }

        var pokemonResponses = await Promise.all(pokemonRequests);//Uma lista contendo as respostas de cada pokémon individual 
        listOfPokemon = []; //alteração aqui // A lista principal com todos os pokémons carregados completos
        for(var i = 0; i < pokemonResponses.length; i++) {
            var pokemonData = await pokemonResponses[i].json();//pokemon individual em formato JSON
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
        var individualPokemon = listFilter[i]; // alteração aqui// p = pokémon individual
        var cardElement = document.createElement('div'); // alteração aqui // cria o card
        cardElement.className = 'col-md-3'; // alteração aqui
        
        var cardHtml = '<div class="c" onclick="openPokemonDetails(' + individualPokemon.id + ')">';
        cardHtml = cardHtml + '<img src="' + individualPokemon.sprites.front_default + '" class="i" alt="' + individualPokemon.name + '">';
        cardHtml = cardHtml + '<h5 class="text-center">#' + individualPokemon.id + ' ' + individualPokemon.name.charAt(0).toUpperCase() + individualPokemon.name.slice(1) + '</h5>';
        cardHtml = cardHtml + '<div class="text-center">';
        
        for(var typeIndex = 0; typeIndex < individualPokemon.types.length; typeIndex++) {
            var typeName = individualPokemon.types[typeIndex].type.name;
            cardHtml = cardHtml + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }
        
        cardHtml = cardHtml + '</div></div>';
        cardElement.innerHTML = cardHtml; // alteração aqui
        clearAndAddPokémonCards.appendChild(cardElement); // alteração aqui
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(typeFilter !== '') { //alteração aqui
        document.getElementById('pageInfo').textContent = 'Mostrando ' + listFilter.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + currentPage; //alteração aqui
    }

    document.getElementById('prevBtn').disabled = currentPage === homePage || typeFilter !== ''; //alteração aqui
    document.getElementById('nextBtn').disabled = typeFilter !== ''; //alteração aqui
}

async function applyFilters() {//alteração aqui//função para aplicar os filtros
    searchByNameOrID = document.getElementById('s').value; // alteração aqui
    typeFilter = document.getElementById('typeFilter').value; //alteração aqui

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(typeFilter !== '') { //alteração aqui
        await listOfPokemonByType(); //alteração aqui
    } else {
        RenderPokemonCards();//alteração aqui
    }
}

function reset() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    searchByNameOrID = ''; // alteração aqui
    typeFilter = ''; //alteração aqui
    currentPage = homePage; // alteração aqui
    loadListOfPokemon(); //alteração aqui
}

function goBackAPage() { //alteração aqui // voltar uma página
    if(currentPage > homePage) { //alteração aqui
        currentPage--; //alteração aqui
        if(typeFilter !== '') { // alteração aqui
            RenderPokemonCards();
        } else {
            loadListOfPokemon(); //alteração aqui
        }
    }
}

function nextPage() { //alteração aqui // próxima página
    currentPage++; //alteração aqui
    if(typeFilter !== '') { //alteração aqui
        RenderPokemonCards(); // alteração aqui //
    } else {
        loadListOfPokemon(); //alteração aqui
    }
}

function pageTheme() { //alteração aqui // tema da página
    document.body.classList.toggle('dark');
}

async function openPokemonDetails(id) {//Modal com detalhes do pokémon
    try {
        var pokemonResponse = await fetch(APIPokemon + '/' + id);// Chama a API usando o ID do pokémon
        var pokemonData = await pokemonResponse.json();//Converte a resposta para JSON
        
        var speciesResponse = await fetch(pokemonData.species.url);// Busca informações da espécie do pokémon
        var speciesData = await speciesResponse.json();// Converte a resposta para JSON
        
        var pokemonDescription = '';
        for(var i = 0; i < speciesData.flavor_text_entries.length; i++) {//Encontra a descrição em inglês
            if(speciesData.flavor_text_entries[i].language.name === 'en') {
                pokemonDescription = speciesData.flavor_text_entries[i].flavor_text;
                break;
            }
        }
        
        document.getElementById('modalTitle').textContent = '#' + pokemonData.id + ' ' + pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);//Titulo do Modal
        
        var htmlContent = '<div class="row"><div class="col-md-6">';//Conteudo do Modal
        htmlContent += '<div class="sprite-container">';
        htmlContent += '<div><img src="' + pokemonData.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';//Imagens
        htmlContent += '<div><img src="' + pokemonData.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        htmlContent += '</div>';
        
        htmlContent += '<p><strong>Tipo:</strong> ';
        for(var i = 0; i < pokemonData.types.length; i++) {
            htmlContent += '<span class="badge type-' + pokemonData.types[i].type.name + '">' + pokemonData.types[i].type.name + '</span> ';
        }
        htmlContent += '</p>';
        
        htmlContent += '<p><strong>Altura:</strong> ' + (pokemonData.height / deciConversion) + ' m</p>';
        htmlContent += '<p><strong>Peso:</strong> ' + (pokemonData.weight / deciConversion) + ' kg</p>';
        
        htmlContent += '<p><strong>Habilidades:</strong> ';
        for(var i = 0; i < pokemonData.abilities.length; i++) {
            htmlContent += pokemonData.abilities[i].ability.name;
            if(i < pokemonData.abilities.length - 1) htmlContent += ', ';
        }
        htmlContent += '</p>';
        
        htmlContent += '</div><div class="col-md-6">';
        
        htmlContent += '<p><strong>Descrição:</strong></p>';
        htmlContent += '<p>' + pokemonDescription.replace(/\f/g, ' ') + '</p>';
        
        htmlContent += '<h6>Estatísticas:</h6>';
        for(var i = 0; i < pokemonData.stats.length; i++) {
            var pokemonStat = pokemonData.stats[i];
            var statFillPercentage = (pokemonStat.base_stat / statMaxValue) * percentageConverter;
            htmlContent += '<div><small>' + pokemonStat.stat.name + ': ' + pokemonStat.base_stat + '</small>';
            htmlContent += '<div class="stat-bar"><div class="stat-fill" style="width: ' + statFillPercentage + '%"></div></div></div>';
        }
        
        htmlContent += '</div></div>';
        
        document.getElementById('modalBody').innerHTML = htmlContent;
        
        var modalInstance = new bootstrap.Modal(document.getElementById('m'));
        modalInstance.show();
        
    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

window.onload = function() {
    startPage();
};

