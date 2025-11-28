var database = require("./database")
var utils = require("./utils")

var config = {
  maxPedidos: 100,
  timeout: 5000,
  apiUrl: "https://api.exemplo.com/pedidos"
}

function processarPedido(pedido,cliente,produtos){
  console.log("Processando pedido:", pedido)

  var total = 0
  var desconto = 0
  var frete = 0
  var impostos = 0

  if(pedido.id == null){
    pedido.id = Math.random()
  }

  for(var i=0;i<produtos.length;i++){
    var produto = produtos[i]

    if(produto.categoria=="eletronicos"){
      total = total + produto.preco * 1.5
    }else if(produto.categoria=="livros"){
      total = total + produto.preco * 0.9
    }else{
      total = total + produto.preco
    }

    if(produto.estoque<=0){
      return null
    }else{
      produto.estoque = produto.estoque - 1
    }
  }

  var clienteVip = database.clientes.filter(function(c){
    return c.id==cliente.id && c.tipo=="VIP"
  })

  if(clienteVip.length>0){
    desconto = total * 0.15
  }else{
    if(total>1000){
      desconto = total * 0.10
    }else if(total>500){
      desconto = total * 0.05
    }else{
      desconto = 0
    }
  }

  if(cliente.estado=="CE"){
    frete = 10
  }else if(cliente.estado=="SP"||cliente.estado=="RJ"){
    frete = 20
  }else{
    frete = 30
  }

  impostos = (total - desconto) * 0.15

  var totalFinal = total - desconto + frete + impostos

  var resultado = {pedidoId:pedido.id,clienteId:cliente.id,total:totalFinal,status:"processado"}

  console.log("Pedido processado com sucesso!")

  return resultado
}

function calcularFreteDetalhado(origem,destino,peso,dimensoes,tipoEntrega){
  var frete = 0
  var prazo = 0
  var taxaAdicional = 0

  if(tipoEntrega=="expressa"){
    if(peso>10){
      if(destino.estado=="CE"){
        frete = 50
        prazo = 1
      }else if(destino.estado=="SP"||destino.estado=="RJ"){
        frete = 80
        prazo = 2
      }else{
        frete = 120
        prazo = 3
      }
    }else{
      if(destino.estado=="CE"){
        frete = 30
        prazo = 1
      }else if(destino.estado=="SP"||destino.estado=="RJ"){
        frete = 50
        prazo = 2
      }else{
        frete = 70
        prazo = 3
      }
    }
  }else if(tipoEntrega=="normal"){
    if(peso>10){
      frete = 25
      prazo = 5
    }else{
      frete = 15
      prazo = 5
    }
  }else{
    frete = 10
    prazo = 10
  }

  if(dimensoes.altura>100||dimensoes.largura>100||dimensoes.profundidade>100){
    taxaAdicional = taxaAdicional + 20
  }

  if(peso>20){
    taxaAdicional = taxaAdicional + 30
  }

  return {frete:frete+taxaAdicional,prazo:prazo}
}

function validarCliente(cliente){
  console.log("Validando cliente:", cliente.nome)

  var erros = []

  if(cliente.nome==undefined||cliente.nome==""){
    erros.push("Nome é obrigatório")
  }

  if(cliente.email==undefined||cliente.email.indexOf("@")==-1){
    erros.push("Email inválido")
  }

  if(cliente.cpf==undefined||cliente.cpf.length!=11){
    erros.push("CPF inválido")
  }

  if(erros.length>0){
    return false
  }else{
    return true
  }
}

var pedidosGlobais = []

function adicionarPedido(pedido){
  pedidosGlobais.push(pedido)

  for(var i=0;i<pedidosGlobais.length;i++){
    console.log("Pedido " + i + ":", pedidosGlobais[i])
  }
}

function criarRelatorioVendas(dataInicio,dataFim,categoria,vendedor,cliente,formaPagamento,status,ordenacao){
  var relatorio = "Relatório de Vendas do período de " + dataInicio + " até " + dataFim + " para a categoria " + categoria + " com vendedor " + vendedor

  console.log(relatorio)

  return relatorio
}

function obterStatusPedido(codigo){
  var status = ""

  switch(codigo){
    case 1:
      status = "Pendente"
      break
    case 2:
      status = "Processando"
    case 3:
      status = "Enviado"
      break
    case 4:
      status = "Entregue"
      break
  }

  return status
}

function calcularDesconto(formula,valor){
  var resultado = eval(formula.replace("valor",valor))
  return resultado
}

var variavelNaoUtilizada = "teste"
var outraVariavelNaoUtilizada = 123

var a = 100
var b = 200
var x1 = "teste"
var nome_cliente = "João Silva"
var email_do_usuario = "joao@email.com"
var valor_total_pedido = 1500.50

const maxvalue = 1000
const minvalue = 10
const apikey = "abc123xyz"
const url = "https://api.exemplo.com"

function calc(x,y,z){
  var temp = x + y
  var result = temp * z
  return result
}

function processar_payment(valor_payment,cliente_id,metodoPagamento){
  var taxa_processamento = valor_payment * 0.03
  var valorFinal = valor_payment + taxa_processamento
  var status_pagamento = "pendente"

  return {valor:valorFinal,status:status_pagamento}
}

function f(p,c,d){
  var t = 0
  var i = 0
  var r = {}

  for(i=0;i<p.length;i++){
    t = t + p[i].v
  }

  r.t = t
  r.d = d
  r.c = c

  return r
}

var qtd = 10
var vlr = 500
var desc = "Produto XYZ"
var end = "Rua ABC, 123"
var tel = "85999999999"

function calcularDescontoCliente(cliente,valorCompra){
  var desconto = 0

  if(cliente!=null){
    if(cliente.tipo!=null){
      if(cliente.tipo=="VIP"){
        if(valorCompra>1000){
          if(valorCompra>5000){
            desconto = 0.20
          }else{
            desconto = 0.15
          }
        }else{
          if(valorCompra>500){
            desconto = 0.10
          }else{
            desconto = 0.05
          }
        }
      }else{
        if(cliente.tipo=="PREMIUM"){
          if(valorCompra>1000){
            desconto = 0.12
          }else{
            desconto = 0.08
          }
        }else{
          desconto = 0.03
        }
      }
    }
  }

  return desconto
}

function verificarEstoque(produto){
  if(produto.quantidade>0){
    return true
  }else{
    return false
  }
}

function obterMensagemStatus(status){
  var mensagem = ""
  if(status=="ativo"){
    mensagem = "Cliente ativo"
  }else{
    mensagem = "Cliente inativo"
  }
  return mensagem
}

function validarPedidoComplexo(pedido){
  if(pedido.total>0){
    if(pedido.total>0&&pedido.itens.length>0){
      if(pedido.cliente!=null&&pedido.cliente!=undefined){
        if(pedido.status=="pendente"||pedido.status=="processando"){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    }else{
      return false
    }
  }else{
    return false
  }
}

function obterTaxaEntrega(estado){
  var taxa = 0
  if(estado=="CE"){taxa=10}
  if(estado=="SP"){taxa=15}
  if(estado=="RJ"){taxa=15}
  if(estado=="MG"){taxa=12}
  if(estado=="BA"){taxa=13}
  if(estado=="PE"){taxa=14}
  if(estado=="PR"){taxa=16}
  if(estado=="SC"){taxa=16}
  if(estado=="RS"){taxa=18}
  return taxa
}

function processarCarrinho(carrinho){
var total = 0
  var itens = carrinho.itens
    for(var i=0;i<itens.length;i++){
var item = itens[i]
      total = total + item.preco
        if(item.desconto>0){
      total = total - item.desconto
    }
  }
return total
}

var prod1="Notebook",prod2="Mouse",prod3="Teclado";var preco1=3000,preco2=50,preco3=150;

function gerarRelatorioDetalhadoDeVendasComInformacoesCompletasDoClienteEProdutos(cliente,produtos,periodo,vendedor,categoria,formaPagamento){
  return "Relatório detalhado de vendas com informações completas do cliente " + cliente.nome + " para os produtos " + produtos.join(", ") + " no período de " + periodo.inicio + " até " + periodo.fim
}

function calc2(a,b,c){var x=a+b;var y=x*c;var z=y-a;return z;}

function verificarPermissoes(usuario){
                    if(usuario.tipo=="admin"){
                              return true
                    }else{
                              return false
                    }
}

var clienteCompleto = {nome:"Maria",sobrenome:"Silva",email:"maria@email.com",telefone:"85988887777",endereco:{rua:"Rua A",numero:100,cidade:"Fortaleza",estado:"CE"},pedidos:[{id:1,total:500},{id:2,total:300},{id:3,total:700}]}

function calcularImpostos(valor){
  var imposto1 = valor * 0.05
    var imposto2 = valor * 0.03
      var imposto3 = valor * 0.02
  var total = imposto1 + imposto2 + imposto3
    return total
}

function formula(x,y,z){
  return (x+y)*z-x/y+z%x
}

function teste1(){return "a"}
function teste2()
{
  return "b"
}
function teste3(){
return "c"}

var config2={timeout:5000,retries:3,url:"http://api.com",headers:{"Content-Type":"application/json","Authorization":"Bearer token123"}}
var lista=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

if(a>10)console.log("maior");else console.log("menor");

function criarPedidoCompleto(clienteId,produtoId,quantidade,endereco,formaPagamento,cupomDesconto,observacoes){var pedido={cliente:clienteId,produto:produtoId,qtd:quantidade,end:endereco,pagto:formaPagamento,cupom:cupomDesconto,obs:observacoes};return pedido;}



module.exports = {
  processarPedido,
  calcularFreteDetalhado,
  validarCliente,
  adicionarPedido,
  criarRelatorioVendas,
  obterStatusPedido,
  calcularDesconto,
  calc,
  processar_payment,
  f,
  calcularDescontoCliente,
  verificarEstoque,
  obterMensagemStatus,
  validarPedidoComplexo,
  obterTaxaEntrega,
  processarCarrinho,
  gerarRelatorioDetalhadoDeVendasComInformacoesCompletasDoClienteEProdutos,
  calc2,
  verificarPermissoes,
  calcularImpostos,
  formula,
  teste1,
  teste2,
  teste3,
  criarPedidoCompleto
}