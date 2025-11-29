var listOfPokemon = []; //alteração aqui // lista de pokémons 
var b = []; 
var currentPage = 1; //alteração aqui // página atual
var itensPerPage = 20; //alteração aqui // número de itens por página
var e = '';
var typeFilter = ''; //alteração aqui// filtro de tipo
var g = null;

const API = 'https://pokeapi.co/api/v2/pokemon'; 
const API2 = 'https://pokeapi.co/api/v2/type';

async function startPage() { //alteração aqui // inicia a página
    document.getElementById('loading').innerHTML = '';
    for(var i = 0; i < itensPerPage; i++) {
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }
    
    try {
        var r = await fetch(API2);
        var dt = await r.json();
        var sel = document.getElementById('typeFilter');
        for(var i = 0; i < dt.results.length; i++) {
            var opt = document.createElement('option');
            opt.value = dt.results[i].name;
            opt.textContent = dt.results[i].name.charAt(0).toUpperCase() + dt.results[i].name.slice(1);
            sel.appendChild(opt);
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
        var off = (currentPage - 1) * d;
        var ur = API + '?limit=' + d + '&offset=' + off;
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
        
        b = [...listOfPokemon]; //alteração aqui
        UNIFOR();
    } catch(error) {
        console.log('erro ao carregar');
        alert('Erro ao carregar Pokémons!');
    }
}

async function listOfPokemonByType() { //alteração aqui // lista de pokémons por tipo
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        var ur = API2 + '/' + typeFilter;
        var r = await fetch(ur);
        var dt = await r.json();

        var pr = [];
        var pokemonLimitPerType = dt.pokemon.length > 100 ? 100 : dt.pokemon.length; // alteração aqui //para limitar a 100 pokémons por tipo
        for(var i = 0; i < pokemonLimitPerType; i++) {
            pr.push(fetch(dt.pokemon[i].pokemon.url));
        }

        var rps = await Promise.all(pr);
        listOfPokemon = []; //alteração aqui
        for(var i = 0; i < rps.length; i++) {
            var p = await rps[i].json();
            listOfPokemon.push(p); //alteração aqui
        }

        b = [...listOfPokemon]; //alteração aqui
        UNIFOR();
    } catch(error) {
        console.log('erro ao carregar tipo');
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function UNIFOR() {
    var g = document.getElementById('pokemonGrid');
    g.innerHTML = '';

    var fil = b;
    if(e !== '') {
        fil = fil.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(e.toLowerCase()) ||
                   pokemon.id.toString().includes(e);
        });
    }

    for(var i = 0; i < fil.length; i++) {
        var p = fil[i];
        var fdp = document.createElement('div');
        fdp.className = 'col-md-3';
        
        var html = '<div class="c" onclick="showDetails(' + p.id + ')">';
        html = html + '<img src="' + p.sprites.front_default + '" class="i" alt="' + p.name + '">';
        html = html + '<h5 class="text-center">#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';
        
        for(var j = 0; j < p.types.length; j++) {
            var typeName = p.types[j].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }
        
        html = html + '</div></div>';
        fdp.innerHTML = html;
        g.appendChild(fdp);
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(typeFilter !== '') { //alteração aqui
        document.getElementById('pageInfo').textContent = 'Mostrando ' + fil.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + currentPage; //alteração aqui
    }

    document.getElementById('prevBtn').disabled = currentPage === 1 || typeFilter !== ''; //alteração aqui
    document.getElementById('nextBtn').disabled = typeFilter !== ''; //alteração aqui
}

async function f() {
    e = document.getElementById('s').value;
    typeFilter = document.getElementById('typeFilter').value; //alteração aqui

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(typeFilter !== '') { //alteração aqui
        await lbt();
    } else {
        UNIFOR();
    }
}

function r() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    e = '';
    typeFilter = ''; //alteração aqui
    currentPage = 1; // alteração aqui
    loadListOfPokemon(); //alteração aqui
}

function p1() {
    if(currentPage > 1) { //alteração aqui
        currentPage--; //alteração aqui
        if(typeFilter !== '') { // alteração aqui
            UNIFOR();
        } else {
            loadListOfPokemon(); //alteração aqui
        }
    }
}

function p2() {
    currentPage++; //alteração aqui
    if(typeFilter !== '') { //alteração aqui
        UNIFOR();
    } else {
        loadListOfPokemon(); //alteração aqui
    }
}

function x() {
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
    i();
};
