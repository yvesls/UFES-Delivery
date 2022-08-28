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
                
            ).then(function(response) {
                if(response.status >199 && response.status < 300){
                    return response.json()
                }else if(response.status == 400){ // o dado não foi encontrado
                    return 400
                }else if(response.status == 409){ // o dado já está cadastrado
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
            }).then(function(data) {
            $(".carregando").addClass("d-none")
            console.log(data)
            return data.result
        }).catch((e)=>{
            $(".carregando").addClass("d-none")
            // console.log(e.status)
            console.log("Ocorreu algum erro:", e)
        })
    }

    let checkDiv = document.getElementById("check-situacao")

    checkDiv.addEventListener('click', exibeCaixa)

    function exibeCaixa(){
        let iconCima = document.getElementById("icon-situacao-2");
        let iconBaixo = document.getElementById("icon-situacao");
        let caixaComChecks = document.getElementById("select-checks");
        
        caixaComChecks.style.display = 'block';
        iconCima.style.display = 'inline';
        iconBaixo.style.display = 'none';

        caixaComChecks.addEventListener('mouseleave', someCaixa);
        function someCaixa(){
            caixaComChecks.style.display = 'none';
            iconCima.style.display = 'none';
            iconBaixo.style.display = 'inline';
        }
        
    }
                
    async function rodaAplicacao(){
        let usuario = 1, users;

        await fazerReq(`/user/get/client/${usuario}`, 'GET').then((dadosUsuario)=>{
            
            let nomeUsuario = dadosUsuario.no_usuario;
            document.getElementById("nomeUsuario").innerHTML = nomeUsuario;

            async function getAllUsers(){
                await fazerReq(`/user/get/client/all`, 'GET').then((dadosUsuario)=>{
                    users = dadosUsuario
                })
            }getAllUsers()

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

            function formataStatus(pedido, i){
                console.log(pedido[i])
                if(pedido[i].cd_status == 1){
                    return "confirmado"
                }else if(pedido[i].cd_status == 4){
                    return "em andamento"
                }else if(pedido[i].cd_status == 5){
                    return "enviado"
                }else if(pedido[i].cd_status == 6){
                    return "cancelado"
                }
            }

            async function mudaStatusPedido(cdPedido, cdUsuario){
                let jsonPedido = {
                        "cd_usuario": cdUsuario,
                        "cd_pedido": cdPedido,
                        "cd_status": 3,
                        "ds_email":'adm@ufesdelivery.com.br',
                        "cd_senha": "1234"
                    }
                await fazerReq("/order/update", "PATCH", jsonPedido)
            }

            async function exibeBusca(pedido, i, mes, hora, minuto, cliente){
                let j = 0, td = [], tr = [];
                    tr[i] = document.createElement("TR") // cria linha da tabela
    
                    while(j != 6){
                        td[j] = document.createElement("Td") // 6 colunas da tabela para cada linha
                        j++
                    }
                    
                    $(td[0]).html(pedido[i].cd_pedido); // nomes dos produtos
                    
                    
                    for(let j = 0; j<cliente.length; j++){
                        
                        //console.log(cliente[j].cd_usuario, pedido[i].cd_usuario)
                        if (cliente[j].cd_usuario == pedido[i].cd_usuario){
                            //mudaStatusPedido(pedido[i].cd_status, cliente[j].cd_usuario)
                            $(td[1]).html(cliente[j].no_usuario)
                        }
                    }
                    
                    
                    mes = pedido[i].dt_ultima_alteracao.mes.toString()
                    hora = pedido[i].dt_ultima_alteracao.hora.toString()
                    minuto = pedido[i].dt_ultima_alteracao.minuto.toString()
                
                    if(mes.length < 2)
                        mes = "0"+ mes
                    if(hora.length < 2)
                        hora = "0"+ hora
                    if(minuto.length < 2)
                        minuto = "0"+ minuto

                    $(td[2]).html(`${pedido[i].dt_ultima_alteracao.dia}/${mes}/${pedido[i].dt_ultima_alteracao.ano} às ${hora}:${minuto}`);
                        
                    $(td[3]).html(pedido[i].vl_total_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                        
                    $(td[4]).append('<img src="imagens/plus-solid.svg" class="icons-sacola" data-toggle="modal" data-target="#pedidoCancelado">'); 

                    $(td[5]).html(formataStatus(pedido, i))

                    $(tr[i]).append(td[0]) // insere coluna como filho da linha
                    $(tr[i]).append(td[1])
                    $(tr[i]).append(td[2])
                    $(tr[i]).append(td[3])
                    $(tr[i]).append(td[4])
                    $(tr[i]).append(td[5])

                    $("#produtosTbody").prepend(tr[i]) 
                
            }

            async function resgataPedido(){
                await fazerReq("/order/get/all", "GET").then((pedido)=>{
                    let diaAtual, mesAtual, anoAtual, qtdPedidosDia = 0;
                    let data = new Date;
                    let qtdPedidos, mes, hora, minuto;
                    qtdPedidos = pedido.length
                    diaAtual = data.getDate()
                    mesAtual = data.getMonth()+1
                    anoAtual = data.getFullYear()

                    for(i = 0; i < qtdPedidos; i++){
                        //console.log(pedido[i])
                        
                        if(pedido[i].dt_ultima_alteracao.ano == anoAtual && pedido[i].dt_ultima_alteracao.dia == diaAtual && pedido[i].dt_ultima_alteracao.mes == mesAtual){

                            if(pedido[i].cd_status == 1){  
                                mudaStatusPedido(pedido[i].cd_pedido, pedido[i].cd_usuario)
                            }
    
                            if(pedido[i].cd_status == 1){
                                exibeBusca(pedido, i, mes, hora, minuto, users)
                            }
                            qtdPedidosDia++
                        }
                    }
                    if(qtdPedidosDia == 0) {
                        if($("#nEncontrado")){
                            $("#nEncontrado").remove()
                        }
                        
                        let div = document.createElement("div")
                        $(div).addClass("n-funcioando")
                        $(div).attr("id", "nEncontrado")
                        $(div).html("Não há nenhum pedido registrado para o dia de hoje.")
                        $("#container-middle").append(div) 
                    }
                })
            }resgataPedido()

            $(document.getElementById("buscarPedidos")).on("click", buscaPorDataETipo);
            
            async function buscaPorDataETipo() {
                // let data = new Date;
                
                // console.log(data)
                let inicio = document.getElementById("inicioBusca").value, fim = document.getElementById("fimBusca").value;
                let emAndamento = document.getElementById("EA").checked;
                let confirmado = document.getElementById("CF").checked;
                let enviados = document.getElementById("EV").checked;
                let cancelados = document.getElementById("CA").checked;
                let todos = document.getElementById("TD").checked;
                // 

                if (fim == ''){
                    fim = inicio
                    // `${data.getFullYear()}-${insereZeroNoHora(data.getMonth())+parseInt(data.getMonth()+1)}-${insereZeroNoHora(data.getDate())+data.getDate()}`
                }
                if((todos || confirmado|| cancelados || enviados || emAndamento) && inicio != '') {
                    let status = 2
                    if(confirmado || todos){
                        status = 1
                    }
                    
                    // console.log(inicio, fim)
                    let anoIn = inicio.slice(0, 4)
                    let mesIn = inicio.slice(5, 7)
                    let diaIn = inicio.slice(8, 10)

                    let anoFin = fim.slice(0, 4)
                    let mesFin = parseInt(fim.slice(5, 7))
                    let diaFin = parseInt(fim.slice(8, 10))+1

                    if((mesFin == 1 || mesFin == 3 || mesFin == 5 || mesFin == 7 || mesFin == 8 || mesFin == 10 || mesFin == 12) && diaFin == 31){
                        diaFin = 1;
                        mesFin ++;
                    }else if(diaFin == 30){
                        diaFin = 1;
                        mesFin ++;
                    }

                    let jsonInicio = {
                        "dt_min_ultima_alteracao" : {
                            "dia": parseInt(diaIn),
                            "mes": parseInt(mesIn),
                            "ano": parseInt(anoIn)
                        },
                        "dt_max_ultima_alteracao" : {
                            "dia": parseInt(diaFin),
                            "mes": parseInt(mesFin),
                            "ano": parseInt(anoFin)
                        }, 
                        "cd_status": status
                    }

                    //console.log(jsonInicio)
                    
                    await fazerReq("/order/get", "POST", jsonInicio).then((pedido)=>{
                        $("#produtosTbody").html('')
                        //console.log(qtdPedidos)
                        //console.log(pedido)
                        
                        if(pedido){
                            if($("#nEncontrado")){
                                $("#nEncontrado").remove()
                            }
                            
                            let mes, hora, minuto
                            let qtdPedidos = pedido.length

                            for(i = 0; i < qtdPedidos; i++){
                                exibeBusca(pedido, i, mes, hora, minuto, users)
                                
                            } 
                        } else {
                            if($("#nEncontrado")){
                                $("#nEncontrado").remove()
                            }
                            
                            let div = document.createElement("div")
                            $(div).addClass("n-funcioando")
                            console.log($("#nEncontrado"))
                            $(div).attr("id", "nEncontrado")
                            $(div).html("Não possui pedidos de acordo com a data informada.")
                            $("#container-middle").append(div) 
                        }
                    })
                }
            }
        })
        
        $("#voltar").on("click", ()=>{
            location.replace("/UFES-Delivery/index.html")
        })

    }rodaAplicacao()
})
