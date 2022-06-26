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