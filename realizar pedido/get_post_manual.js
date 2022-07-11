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
    //     no_logradouro: "Rua Tal 2",
    //     no_bairro: "Gerúndio 2",
    //     ds_numero: "A209",
    //     nu_cep: "29500-000",
    //     ds_complemento: "Ao lado do banco do Brasil"
    // }));
        
    // console.log(request("/user/new", "post", {
    //     cd_endereco: 2,
    //     email_usuario: "marcos.couto@gmail.com",
    //     senha_usuario: "123456789",
    //     nome_usuario: "marcos couto",
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



