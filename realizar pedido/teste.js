$(document).ready(function(){    

    const template_url = "http://127.0.0.1:5000"

    const request = (url, tipo, conteudo) => {
        const request = new XMLHttpRequest()

        const is_post = (tipo.toUpperCase() === "POST")

        request.open(tipo, `${template_url}${url}`, is_post)
        request.setRequestHeader("Content-type", "application/json");
        request.send(is_post ? JSON.stringify(conteudo) : null)

        //console.log(tipo, url, is_post, JSON.stringify(conteudo));
        request.onreadystatechange = () => {
            if(request.readyState == 4 && request.status == 200) {
                
                return request;
            }else {
                return request.response;
            }
        }
        
    }


    // console.log(request("/product/get/all", "get"));

    // console.log(request("/city/new", "post", {
    //     nome: "alegre",
    //     uf: "ES"
    // }));

    // console.log(request("/address/new", "post", {
    //     cd_cidade: 1,
    //     no_logradouro: "Rua Tal",
    //     no_bairro: "Gerúndio",
    //     ds_numero: "A208",
    //     nu_cep: "29500-000",
    //     ds_complemento: "Próximo à praça 22"
    // }));
        
    // console.log(request("/user/new", "post", {
    //     cd_endereco: 1,
    //     email_usuario: "lucio.pena@gmail.com",
    //     senha_usuario: "12345678",
    //     nome_usuario: "Lucio Pena",
    //     tipo_usuario: 1,
    //     email_adm: null,
    //     senha_adm: null
    // }));

    const resposta = request("/product/get/all", "get")

    console.log(resposta)
    

})



