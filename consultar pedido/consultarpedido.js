$(document).ready(() => {

    const template_url = "http://localhost:5000"


    async function fazerReq (url, tipo, conteudo) {
        try {
            return await fetch(`${template_url}${url}`, {
                method: tipo, 
                headers: {
                'Content-Type': "application/json"
                }, 
                body: JSON.stringify(conteudo)}
                
            ).then(response => 
                response.json()
                
            ).then((data) => {
                return data.result
            })
        } catch(e){
            console.log("Ocorreu algum erro:", e)
        }
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
        let usuario = 1;
        await fazerReq(`/user/get/client/${usuario}`, 'GET').then((dadosUsuario)=>{
            console.log(usuario)
            let nomeUsuario = dadosUsuario.no_usuario;
            document.getElementById("nomeUsuario").innerHTML = nomeUsuario;

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

            async function resgataPedido(){
                await fazerReq("/order/get/all", "GET").then((pedido)=>{
                    let situacao, qtdPedidos, mes, hora, minuto
                    console.log(pedido)

                    qtdPedidos = pedido.length

                    if(qtdPedidos != 0){
                        
                        for(i = 0; i < qtdPedidos; i++){
                            if(pedido[i].cd_status == 1){
                                situacao = "confirmado"
                                let j = 0, td = [], tr = [];
                                tr[i] = document.createElement("TR") // cria linha da tabela

                                while(j != 6){
                                    td[j] = document.createElement("Td") // 6 colunas da tabela para cada linha
                                    j++
                                }

                                $(td[0]).html(pedido[i].cd_pedido); // nomes dos produtos

                                async function getDadosUsuario(){
                                    await fazerReq(`/user/get/client/${pedido[i].cd_usuario}`, 'GET').then((dadosUsuario)=>{
                                        $(td[1]).html(dadosUsuario.no_usuario)
                                    })
                                }getDadosUsuario()

                                mes = pedido[i].dt_ultima_alteracao.mes.toString()
                                hora = pedido[i].dt_ultima_alteracao.hora.toString()
                                minuto = pedido[i].dt_ultima_alteracao.minuto.toString()

                                if(mes.length < 2)
                                    mes = "0"+ mes
                                if(hora.length < 2)
                                    hora = "0"+ hora
                                if(minuto.length < 2)
                                    minuto = "0"+ minuto

                                $(td[2]).html(`${pedido[i].dt_inicio.dia}/${mes}/${pedido[i].dt_inicio.ano} às ${hora}:${minuto}`);
                                
                                $(td[3]).html(pedido[i].vl_total_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
                                
                                $(td[4]).append('<img src="imagens/plus-solid.svg" class="icons-sacola" data-toggle="modal" data-target="#pedidoCancelado">'); 

                                $(td[5]).html(situacao)

                                $(tr[i]).append(td[0]) // insere coluna como filho da linha
                                $(tr[i]).append(td[1])
                                $(tr[i]).append(td[2])
                                $(tr[i]).append(td[3])
                                $(tr[i]).append(td[4])
                                $(tr[i]).append(td[5])

                                console.log(tr[i])

                                $("#produtosTbody").prepend(tr[i]) 
                            }
                        } 
                    }
                })
            }resgataPedido()

            $(document.getElementById("buscarPedidos")).on("click", buscaPorDataETipo);
            
            async function buscaPorDataETipo() {
                // let data = new Date;
                
                // console.log(data)
                let inicio = document.getElementById("inicioBusca").value, fim = document.getElementById("fimBusca").value;
                // let emAndamento = document.getElementById("EA").checked;
                // let confirmado = document.getElementById("CF").checked;
                // let enviados = document.getElementById("EV").checked;
                // let cancelados = document.getElementById("CA").checked;
                // let todos = document.getElementById("TD").checked;
                // emAndamento || confirmado || enviados || cancelados || todos && 

                if (fim == ''){
                    fim = inicio
                    // `${data.getFullYear()}-${insereZeroNoHora(data.getMonth())+parseInt(data.getMonth()+1)}-${insereZeroNoHora(data.getDate())+data.getDate()}`
                }
                if(inicio != '') {
                    // console.log(inicio, fim)
                    let anoIn = inicio.slice(0, 4)
                    let mesIn = inicio.slice(5, 7)
                    let diaIn = inicio.slice(8, 10)

                    let anoFin = fim.slice(0, 4)
                    let mesFin = fim.slice(5, 7)
                    let diaFin = fim.slice(8, 10)

                    // console.log(mes)
                    let jsonInicio = {
                        "dt_min_ultima_alteracao" : {
                            "dia": parseInt(diaIn),
                            "mes": parseInt(mesIn),
                            "ano": parseInt(anoIn)
                        },
                        "dt_max_ultima_alteracao" : {
                            "dia": parseInt(diaFin)+1,
                            "mes": parseInt(mesFin),
                            "ano": parseInt(anoFin)
                        }, 
                        "cd_status": 1
                              
                    }
                    console.log(jsonInicio)
                    await fazerReq("/order/get", "POST", jsonInicio).then((pedido)=>{
                        console.log(pedido)
                    })
                }
            }
            
        })
        



    }rodaAplicacao()
})
