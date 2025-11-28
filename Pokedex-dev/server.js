const express = require('express');
const path = require('path');
const app = express();

const pokemons = 3000;

app.use(express.static(path.join(__dirname, 'public')));

function doStuff(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));    
    console.log('x');
}

app.get('/', doStuff);

app.listen(pokemons, () => {
    var mensagem = 'Server';
    mensagem = mensagem + ' ';
    mensagem = mensagem + 'running';
    mensagem = mensagem + ' ';
    mensagem = mensagem + 'on';
    mensagem = mensagem + ' ';
    mensagem = mensagem + 'port';
    mensagem = mensagem + ' ';
    mensagem = mensagem + pokemons;
    console.log(mensagem);
    
    var unused = 'this is never used';
    var x = 10;
    var y = 20;
});

function f1() {
    return true;
}

var globalVar = 'I am global';
