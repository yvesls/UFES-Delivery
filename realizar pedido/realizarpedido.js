$(document).ready(() => {

    //http://127.0.0.1:5000
    //https://34.125.171.237:5000
    const template_url = "http://127.0.0.1:5000"
    
    async function fazerReq (url, tipo, conteudo) {
       
        $(".carregando").removeClass("d-none")
        return await fetch(`${template_url}${url}`, {
            method: tipo, 
            headers: {
            'Content-Type': "application/json"
            }, 
            body: JSON.stringify(conteudo)}
        
        ).then( response => {
            if(response.status >199 && response.status < 300){
                return response.json()
            }else if(response.status == 400){ // o dado não foi encontrado
                return 400
            }else if(response.status == 409){ // o dado já está cadastrado
                $("#encomendarPedido").on("click", exibeErro)
                $("#encomendarPedido").click()
                function exibeErro(){
                    $("#encomendarPedido").attr("data-toggle", "modal");
                    $("#encomendarPedido").attr("data-target", "#erroJaExistePedido");
                }
                return 409
            }else if(response.status >400 && response.status < 500){
                return 4
            }else if(response.status >499 && response.status < 600){
                $("#body").on("click", exibeErro)
                $("#body").click()
                function exibeErro(){
                    $("#body").attr("data-toggle", "modal");
                    $("#body").attr("data-target", "#erro");
                }
            }
        }).then((data) => {
            $(".carregando").addClass("d-none")
                
            if (data.id_address){
                return data.id_address
            }else if(data.id_order){
               return data.id_order
            }else {
                return data.result
            }
        })
        .catch((e) => {
            $(".carregando").removeClass("d-none")
            console.log("Ocorreu algum erro:", e)
        })
        
    }

    // variáveis para conter dados do usuário
    let tipoUsuario, nomeUsuario, usuario = 6, jsonItensPedido = [], qtdItensSacola = 0, qtItens = [], cdProduto = [];

    async function rodaAplicacao(){
        $(document.getElementById("tabela")).addClass("dis-none");

        async function getAtendente(){
            await fazerReq("/user/get/client/1", "GET").then((atendente)=>{
                let select = document.getElementById("dropUsuario");
                let span = document.createElement("span")
                let option = document.createElement("option")
                $(span).html(atendente.no_usuario)
                $(option).html(`<div class="dropdown-item" id="atendente">${atendente.cd_usuario}</div>`)
                $(select).append(option);
                $(select).append(span);
            })
        }

        document.getElementById("registrarNovoUser").onclick = function(){criarUser()};

        async function criarUser(){
            let logradouro, bairro, numero, cep, complemento, enderecoCriado, email, nome, senha;
            logradouro = $("#regLogradouro").val()
            bairro = $("#regBairro").val()
            numero = $("#regNumero").val()
            cep = $("#regCep").val()
            complemento = $("#regComplemento").val()
            email = $("#regEmail").val()
            nome = $("#regNome").val()
            senha = $("#regSenha").val()
            
            jsonEndereco = {
                cd_cidade: 1,
                no_logradouro: logradouro,
                no_bairro: bairro,
                ds_numero: numero,
                nu_cep: cep,
                ds_complemento: complemento
            }

            await fazerReq("/address/new", "POST", jsonEndereco).then((endereco)=>{
                enderecoCriado = endereco
            })
        
            jsonCliente = {
                cd_endereco: enderecoCriado,
                email_usuario: email,
                nome_usuario: nome,
                senha_usuario: senha,
                tipo_usuario: 1,
                email_adm: null,
                senha_adm: null
            }

            await fazerReq("/user/new", "POST", jsonCliente).then(()=>{
                location.replace("index.html")
            })
        }

        await fazerReq("/user/get/client/all", "GET").then((todosUsuarios)=>{
            console.log(todosUsuarios)
            let select = document.getElementById("dropUsuario"), option = [];
            
            getAtendente()
            for(let i = 0; i<todosUsuarios.length; i++){
                option[i] = document.createElement("option")
                $(option[i]).html(`<div class="dropdown-item" id="user${i}">${todosUsuarios[i].cd_usuario}</div>`)
                console.log()
                $(select).append(option[i]);
            }
            
            document.getElementById("escolheUsuario").onclick = function(){escolheUsuario()};
            
            function escolheUsuario(){
                let cdUser = document.getElementById("dropUsuario").value

                if(cdUser == "Escolha um usuário"){
                    $("#erroEscolhaUser").removeClass("d-none");
                }else{
                    usuario = cdUser
                    realizaLogin()
                    $("#escolheUsuario").attr("data-dismiss", "modal")
                    $("#header").removeClass("d-none")
                }
            }

            async function realizaLogin(){
                await fazerReq(`/user/get/client/${usuario}`, 'GET').then((dadosUsuario)=>{
                    tipoUsuario = dadosUsuario.cd_tipo_usuario;
        
                    if(tipoUsuario == 1){
                        nomeUsuario = dadosUsuario.no_usuario;
                        document.getElementById("nomeUsuario").innerHTML = nomeUsuario;
        
                        // variáveis utilizadas daqui para frente
                        let vlTotalCDesc, vlTotalSDesc, somaTotal = 0, qtdProdutos, descontos = {}, descontosSomados = 0;
                        
                        descontos = {
                            "id":"1",
                            "tp_desconto":"Desconto para todo pedido acima de 20,00 R$",
                            "vl_desconto":"5",
                            "qtd_usos":"0",
                            "qtd_max_usos":"30"
                        }
        
                        function modelaMes(mes){
                            if(mes == 0){
                                mes = "Janeiro"
                            }else if(mes == 1){
                                mes = "Fevereiro"
                            }else if(mes == 2){
                                mes = "Março"
                            }else if(mes == 3){
                                mes = "Abril"
                            }else if(mes == 4){
                                mes = "Maio"
                            }else if(mes == 5){
                                mes = "Junho"
                            }else if(mes == 6){
                                mes = "Julho"
                            }else if(mes == 7){
                                mes = "Agosto"
                            }else if(mes == 8){
                                mes = "Setembro"
                            }else if(mes == 9){
                                mes = "Outubro"
                            }else if(mes == 10){
                                mes = "Novembro"
                            }else if(mes == 11){
                                mes = "Dezembro"
                            }
                            return mes;
                        }
        
                        function dataEHora(){
                            let data = new Date();
                            let insereHorario = document.getElementById("dataEHora");
                            let horario = data.getDay() + " " + insereZeroNoHora(data.getHours())+ data.getHours() +":"+ insereZeroNoMinuto(data.getMinutes())+data.getMinutes();
                            $(insereHorario).html(data.getDate() +" "+ modelaMes(data.getMonth()) +" "+ insereZeroNoHora(data.getHours())+ data.getHours() +":"+ insereZeroNoMinuto(data.getMinutes())+data.getMinutes());
                            return horario;
                        }setInterval(dataEHora, 1000)
        
                        function insereZeroNoMinuto(minutos){
                            let min = "";
                            if(minutos < 10){
                                min = "0"
                            }
                            return min;
                        }
        
                        function insereZeroNoHora(hora){
                            let h = "";
                            if(hora < 10){
                                h = "0"
                            }
                            return h;
                        }
        
                        async function mostrarProdutos(){
                            let tratamentoPersonalizado = false;
        
                            await fazerReq("/product/get/all", 'GET').then((produtos)=> {
                                
        
                                qtdProdutos = produtos.length
        
                                let verificaHorarioFunc = dataEHora()
                                let hora = verificaHorarioFunc.slice(2, 4)
                                let dia = verificaHorarioFunc.slice(0, 2)
            
                                if (produtos != -1 && qtdProdutos != 0 && parseInt(dia) != 1 && (parseInt(hora) <= 15) && tratamentoPersonalizado == false) { // && trataObjeto(request.responseText)[1].length != 0 && parseInt(dia) != 1 && (parseInt(hora) >= 15 && parseInt(hora) != 0)
                                    $(document.getElementById("tabela")).removeClass("dis-none");
                                    $(document.getElementsByClassName("container-bottom")).addClass("d-flex");
                                    
                                    // percorre o array dos produtos
                                    for(i = 0; i < qtdProdutos; i++){
                                        
                                        let j = 0, td = [], vlTotal = produtos[i].vl_unitario, tr = [];
                                        tr[i] = document.createElement("TR") // cria linha da tabela
            
                                        while(j != 6){
                                            td[j] = document.createElement("Td") // 6 colunas da tabela para cada linha
                                            j++
                                        }
            
                                        $(td[0]).html(produtos[i].no_produto); // nomes dos produtos
            
                                        $(td[1]).append('<span id="menos'+ i.toString()+'"><img src="realizar pedido/imagens/minus-solid.svg" class="icons p-1 mr-2"></span><span id="valor'+i.toString()+'" value="'+ 1 +'">1</span><span id="mais'+i.toString()+'"><img src="realizar pedido/imagens/plus-solid.svg" class="icons p-1 ml-2"></span>')
                                        //$(".tr").append($(td[1]).html()); // forma de inserir 
                                        
                                        if(produtos[i].cd_categoria == 1){ 
                                            $(td[2]).html("Vitaminas");
                                        }else if(produtos[i].cd_categoria == 2){
                                            $(td[2]).html("Sucos");
                                        }else if(produtos[i].cd_categoria == 3){
                                            $(td[2]).html("Bebidas");
                                        }else if(produtos[i].cd_categoria == 4){
                                            $(td[2]).html("Mistos");
                                        }else if(produtos[i].cd_categoria == 5){
                                            $(td[2]).html("Porções");
                                        }else if(produtos[i].cd_categoria == 6){
                                            $(td[2]).html("Lanches Gourmet");
                                        }
                                        
                                        $(td[3]).html(produtos[i].vl_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                                        $(td[3]).attr("id", "vlUnitario" + i);
            
                                        $(td[4]).html(vlTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })); 
                                        $(td[4]).attr("id", "vlTotal" + i);
            
                                        $(td[5]).append('<img id="sacola'+i.toString()+'" src="realizar pedido/imagens/plus-solid.svg" value="'+ 1 +'" class="icons-sacola" data-toggle="modal">')
            
                                        $(tr[i]).append(td[0]) // insere coluna como filho da linha
                                        $(tr[i]).append(td[1])
                                        $(tr[i]).append(td[2])
                                        $(tr[i]).append(td[3])
                                        $(tr[i]).append(td[4])
                                        $(tr[i]).append(td[5])
            
                                        $("#produtosTbody").prepend(tr[i]) // insere linhas como filhos do corpo da tabela
                                        document.getElementById("tipoDesconto").innerHTML = descontos.tp_desconto;
                                        document.getElementById("desconto").innerHTML = descontos.vl_desconto +"%";
                                        
                                    } 
                                }else if(produtos != -1 || parseInt(dia) == 1 || (parseInt(hora) < 15)){
                                    $(document.getElementById("lojaFechada")).addClass("d-flex");
                                    $(document.getElementById("nFunHorarioEDia")).css("display", "block");
                                }else if(produtos[i].length == 0){
                                    $(document.getElementById("qtdZerada")).css("display", "block");
                                }else if(tratamentoPersonalizado){
                                    $(document.getElementById("lojaFechada")).addClass("d-flex");
                                    $(document.getElementById("nFunPersonalizado")).css("display", "block");
                                }else {
                                    if(produtos == -1){
                                        $(document.getElementById("erroAoCarregarProdutos")).css("display", "block");
                                    }
                                }
                                
                                for(let i = 0; i < qtdProdutos; i++){ // como não estava funcionando a criação de actions dentro da função mostrar produtos, criei por fora
                                    document.getElementById("menos" + i.toString()).onclick = function(){diminuirQtdDoPedido(i)};
                                    document.getElementById("mais" + i.toString()).onclick = function(){aumentarQtdDoPedido(i)};
                                    document.getElementById("sacola" + i.toString()).onclick = function(){getQtdItens(i)};
                                }
                
                                function diminuirQtdDoPedido(i){ // lógica para o button -
                                    let va = document.getElementById("valor"+i)
                                    if(parseInt($(va).html()) > 1){
                                        $(va).html(parseInt($(va).html())- 1) // diminui e exibe 
                                        // lógica de soma e exibição de acordo com a quantidade modificada
                                        let vlTotal = document.getElementById("vlTotal"+i).innerHTML.slice(8).replace(",", ".")
                                        let vlUnitario = document.getElementById("vlUnitario"+i).innerHTML.slice(8).replace(",", ".")
                                        let vlTotalAtt = parseFloat(vlTotal) - parseFloat(vlUnitario);
                                        $(document.getElementById("vlTotal"+i)).html(vlTotalAtt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                                    }
                                }
        
                                function aumentarQtdDoPedido(i){ // lógica para o button +
                                    let va = document.getElementById("valor"+i)
                                    if(parseInt($(va).html()) < 100){
                                        $(va).html(parseInt($(va).html())+ 1) // diminui e exibe 
                                        // lógica de soma e exibição de acordo com a quantidade modificada
                                        let vlTotal = document.getElementById("vlTotal"+i).innerHTML.slice(8).replace(",", ".")
                                        let vlUnitario = document.getElementById("vlUnitario"+i).innerHTML.slice(8).replace(",", ".")
                                        let vlTotalAtt = parseFloat(vlTotal) + parseFloat(vlUnitario);
                                        $(document.getElementById("vlTotal"+i)).html(vlTotalAtt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                                    }
                                    
                                }
        
                                function getQtdItens(i){ 
        
                                    let qtdItem = produtos[i].qt_estoque;
                                    // buscando a quantidade do produto dentro do array e comparando com o selecionado
                                    if(parseInt(document.getElementById("valor" + i).innerHTML)  <= qtdItem){
                                        // Aqui irá a lógica para exibir o modal de sucesso e inserir o item em pagamentos (sacola)
                                        produtos[i].qt_estoque = qtdItem - parseInt(document.getElementById("valor" + i).innerHTML);
                                        adicionarNaSacola(produtos, i)
                                        let selecionaSacola = document.getElementById("sacola"+i)
                                        $(selecionaSacola).attr("data-target", "#adicionadocomsucesso")
                                    }else{
                                        // Aqui irá a lógica para exibir o modal de erro
                                        document.getElementById("qtdEstoqueModal").innerHTML = produtos[i].qt_estoque;
                                        let selecionaSacola = document.getElementById("sacola"+i)
                                        $(selecionaSacola).attr("data-target", "#naoadicionado")
                                    }
                                }
        
                                function adicionarNaSacola(array, i){
                                    // adicionando produtos à sacola em "pagar"
                                    //console.log(array, i)
                                    let tr, td = [], j = 0;
                                    tr = document.createElement("TR")
                                    while(j != 5){
                                        td[j] = document.createElement("TD") // 6 colunas da tabela para cada linha
                                        j++
                                    }
                                    $(td[0]).html(array[i].no_produto);
                
                                    $(td[1]).html(document.getElementById("valor" +i).innerHTML)
                
                                    if(array[i].cd_categoria == 1){
                                        $(td[2]).html("Vitamina");
                                    }else if(array[i].cd_categoria == 2){
                                        $(td[2]).html("Suco");
                                    }else if(array[i].cd_categoria == 3){
                                        $(td[2]).html("Bebida");
                                    }else if(array[i].cd_categoria == 4){
                                        $(td[2]).html("Sanduíche");
                                    }else if(array[i].cd_categoria == 5){
                                        $(td[2]).html("Porção");
                                    }else if(array[i].cd_categoria == 6){
                                        $(td[2]).html("Hambúrguer");
                                    }
                
                                    $(td[3]).html(array[i].vl_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                                    $(td[3]).attr("id", "vlUnitarioSacola" + i);
                
                                    $(td[4]).html(document.getElementById("vlTotal" + i).innerHTML); 
                                    $(td[4]).attr("id", "vlTotalSacola" + i);
                
                                    $(tr).append(td[0]) // insere coluna como filho da linha
                                    $(tr).append(td[1])
                                    $(tr).append(td[2])
                                    $(tr).append(td[3])
                                    $(tr).append(td[4])
        
                                    qtItens[qtdItensSacola] = parseInt(document.getElementById("valor" +i).innerHTML) 
                                    cdProduto[qtdItensSacola] = array[i].cd_produto
                                    console.log(qtItens[qtdItensSacola])
                                    console.log(cdProduto[qtdItensSacola])
        
                                    $("#produtosPagamento").prepend(tr)
                                    // fim do - adicionando produtos à sacola em "pagar"
                                    
                                    // tratar valor total, resgatando desconto e calculando no processo
                                    
                                    vlTotalSDesc = td[4].innerHTML.slice(8);
                                    vlTotalSDesc = somaVlItens(vlTotalSDesc)
                                    valorTotalAPagar();
                                    document.getElementById("totalAPagarPagamento").innerHTML = vlTotalSDesc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                    document.getElementById("totalAPagarCDescontoPagamento").innerHTML = vlTotalCDesc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                    document.getElementById("totalAPagar").innerHTML = vlTotalCDesc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                    document.getElementById("descontoPagamento").innerHTML = descontosSomados.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                    qtdItensSacola++;
                                }
                
                                function somaVlItens(vlTotalItem){
                                    vlTotalItem = parseFloat(vlTotalItem)
                                    somaTotal = somaTotal + vlTotalItem;
                
                                    return somaTotal;
                                }
                
                                $(document.getElementById("buttonPagar")).on("click", buttonPagar);
                                
                                function buttonPagar(){
                                    let temItemSacola = document.getElementById("totalAPagar").innerHTML
                
                                    if(temItemSacola != ""){
                                        let pagar = document.getElementById("buttonPagar");
                                        $(pagar).attr("data-toggle", "modal")
                                        $(pagar).attr("data-target", "#fazerPagamento")
                                        totalpago = document.getElementById("totalAPagarCDescontoPagamento").innerHTML
                                        document.getElementById("requisitoPagar").innerHTML = ""
                                    }else {
                                        document.getElementById("requisitoPagar").innerHTML = "É necessário ter algum item na sacola e endereço cadastrado para acessar esta janela."
                                    }
                                }
        
                                // função que calcula valor total a pagar e exibe na aba de descontos
                                function valorTotalAPagar(){
                            
                                    if(descontos.qtd_usos < descontos.qtd_max_usos && vlTotalSDesc >= 20){
                                        document.getElementById("vlTotalSDesc").innerHTML = "Valor Total";
                                        vlTotalCDesc = vlTotalSDesc - (vlTotalSDesc*(descontos.vl_desconto/100))
                                        descontosSomados = vlTotalSDesc*(descontos.vl_desconto/100);
                                    }else {
                                        document.getElementById("vlTotalSDesc").innerHTML = "Valor Total Sem Desconto";
                                        vlTotalCDesc = vlTotalSDesc
                                    }
                                }
        
                                // resgata o endereço e exibe na janela de pagamento e janela de resumo do pedido
                                async function getEndereco(){
                                    let usuario
                                    if(dadosUsuario.cd_usuario == 2){
                                        usuario = {
                                            "cd_usuario":dadosUsuario.cd_usuario,
                                            "ds_email":'LUCIO.PENA@GMAIL.COM',
                                            "cd_senha": 12345678,
                                            "cd_token": null
                                        }
                                    }
                                    if(dadosUsuario.cd_usuario == 3){
                                        usuario = {
                                            "cd_usuario":dadosUsuario.cd_usuario,
                                            "ds_email":'SEU.JORGE@GMAIL.COM',
                                            "cd_senha": 123456789,
                                            "cd_token": null
                                        }
                                    }

                                    if(dadosUsuario.cd_usuario == 4){
                                        usuario = {
                                            "cd_usuario":dadosUsuario.cd_usuario,
                                            "ds_email":'ROS.REGINALDO@GMAIL.COM',
                                            "cd_senha": 12345678911,
                                            "cd_token": null
                                        }
                                    }

                                    await fazerReq("/user/get/address", "POST", usuario).then((endereco)=>{
                                        let cidade
                                        // console.log(endereco)
                                        // console.log(endereco.cd_cidade)
                                        if(endereco.cd_cidade == 1)
                                            cidade = "Alegre"
                                        document.getElementById("nomeNoEndereco").innerHTML = dadosUsuario.no_usuario.toLowerCase() 
                                        document.getElementById("logradouroEndereco").innerHTML = endereco.no_logradouro.toLowerCase()
                                        document.getElementById("bairroEndereco").innerHTML = endereco.no_bairro.toLowerCase()
                                        document.getElementById("cidadeEndereco").innerHTML = cidade
                                        document.getElementById("numEndereco").innerHTML = endereco.ds_numero
                                        document.getElementById("complementoEndereco").innerHTML = endereco.ds_complemento.toLowerCase()
                                        document.getElementById("nomeNoEndereco2").innerHTML = dadosUsuario.no_usuario.toLowerCase() 
                                        document.getElementById("logradouroEndereco2").innerHTML = endereco.no_logradouro.toLowerCase()
                                        document.getElementById("bairroEndereco2").innerHTML = endereco.no_bairro.toLowerCase()
                                        document.getElementById("cidadeEndereco2").innerHTML = cidade
                                        document.getElementById("numEndereco2").innerHTML = endereco.ds_numero
                                        document.getElementById("complementoEndereco2").innerHTML = endereco.ds_complemento.toLowerCase()
                                       
                                    });
                                }getEndereco()
        
                                $("#encomendarPedido").on("click", encomendarPedido);
                                
                                // função que trata a criação do pedido e retorna o resumo do pedido
                                async function encomendarPedido(){
                                    
                                    $("#totalPagoResumo").html(document.getElementById("totalAPagarCDescontoPagamento").innerHTML = vlTotalCDesc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                                    let pagamentoConcluido = true;
                                    let k

                                        
                                    //console.log(parseFloat(document.getElementById("totalAPagarCDescontoPagamento").innerHTML.slice("8").replace(",", ".")))
                                    let jsonPedido = {
                                        "cd_usuario": dadosUsuario.cd_usuario
                                        //parseFloat(document.getElementById("totalAPagarCDescontoPagamento").innerHTML.slice("8").replace(",", "."))
                                    }
                                    // console.log(jsonPedido)
                                    await fazerReq("/order/new", "POST", jsonPedido).then((idPedido)=>{
                                        
                                        if(pagamentoConcluido){
                                                
                                            console.log(idPedido)
    
                                            //resgatar itens do pedido e inserir no banco de dados 
            
                                            async function insereItensPedido(){
                                        
                                                for (k = 0; k < qtdItensSacola; k ++){
                                                    jsonItensPedido[k] = {
                                                        "cd_pedido": idPedido,
                                                        "cd_produto": cdProduto[k],
                                                        "qt_itens": qtItens[k]
                                                    }
                                                     console.log(jsonItensPedido[k])
                                                    await fazerReq("/order/add/product", "POST", jsonItensPedido[k])
                                                }
                                            }insereItensPedido()
                                                
                                            async function mudaStatusPedido(){
                                                let jsonPedido = {
                                                    "cd_usuario": dadosUsuario.cd_usuario,
                                                    "cd_pedido": idPedido,
                                                    "cd_status": 3,
                                                    "ds_email":'adm@ufesdelivery.com.br',
                                                    "cd_senha": 1234
                                                }
                                                await fazerReq("/order/update", "POST", jsonPedido)
                                            }mudaStatusPedido()

                                            let modalSucesso = document.getElementById("encomendarPedido");
                                            $(modalSucesso).attr("data-target", "#resumoPedido")
                                            $(modalSucesso).attr("data-dismiss", "modal")
                                            $(modalSucesso).attr("data-toggle", "modal")
                                        }else {
                                            $(document.getElementById("encomendarPedido")).attr("data-target", "#erroPagamento")
                                        } 
                                        
                                    })
                                }
                            }); // fim mostrar produtos (como tudo depende dele, praticamente, o conteúdo todo ficará por aqui)
                            
                        }mostrarProdutos()
        
                    }else 
                        location.replace("./consultar pedido/consultarpedido.html")
                })
            }
        })
            
    }rodaAplicacao()
}) 