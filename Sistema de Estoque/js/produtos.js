const formulario = document.querySelector("#form-produto");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const codigo = document.querySelector("#codigo").value;
    const nome = document.querySelector("#nome").value;
    const categoria = document.querySelector("#categoria").value;
    const quantidade = document.querySelector("#quantidade").value;
    const preco = document.querySelector("#preco").value;
    const estoqueMinimo = document.querySelector("#estoque-minimo").value;

    console.log({
        codigo,
        nome,
        categoria,
        quantidade,
        preco,
        estoqueMinimo
    });
});