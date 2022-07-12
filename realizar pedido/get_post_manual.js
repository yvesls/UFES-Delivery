$(document).ready(function(){    

    const template_url = "http://127.0.0.1:5000"

    const request = (url, tipo, conteudo) => {
        const request = new XMLHttpRequest()

        const is_post = (tipo.toUpperCase() === "POST")

        request.open(tipo, `${template_url}${url}`, is_post)
        request.setRequestHeader("Content-type", "application/json");
        request.send(is_post ? JSON.stringify(conteudo) : null)

        //console.log(tipo, url, is_post, JSON.stringify(conteudo));
        
        return request.response;
        
    }


    //console.log(request("/product/get/all", "get"));

    // console.log(request("/city/new", "post", {
    //     nome: "alegre",
    //     uf: "ES"
    // }));

    // console.log(request("/address/new", "post", {
    //     cd_cidade: 1,
    //     no_logradouro: "Rua Tal 3",
    //     no_bairro: "Gerúndio 3",
    //     ds_numero: "A203",
    //     nu_cep: "29500-000",
    //     ds_complemento: "Ao lado do banco do Brasil"
    // }));
        
    // console.log(request("/user/new", "POST", {
    //     cd_endereco: 3,
    //     email_usuario: "MARIA.w@GMAIL.COM",
    //     senha_usuario: "123111332",
    //     nome_usuario: "MARIa DOIS",
    //     tipo_usuario: 1,
    //     email_adm: null,
    //     senha_adm: null
    // }));

    // const resposta = request("/product/get/all", "get")

    // console.log(resposta)
    
    // criar novo cliente (pelo menos 2)

    // let jsonPedido = {
    //     "cd_usuario": 3
    // }
    // console.log(request("/order/new", "POST", jsonPedido))
})



