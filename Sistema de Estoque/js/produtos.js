
// Array que armazenará os produtos cadastrados
const produtos = [];

// Seleciona o formulário no HTML
const formulario = document.querySelector("#form-produto");

// Executa a função quando o formulário é enviado
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Cria um objeto com os dados informados no formulário
    const produto = {
        codigo: document.querySelector("#codigo").value.trim(),
        nome: document.querySelector("#nome").value.trim(),
        categoria: document.querySelector("#categoria").value.trim(),
        quantidade: Number(document.querySelector("#quantidade").value),
        preco: Number(document.querySelector("#preco").value),
        estoqueMinimo: Number(document.querySelector("#estoque-minimo").value)
    };

    // Adiciona o objeto ao array
    produtos.push(produto);

    // Exibe o conteúdo do array no console
    console.table(produtos);

    // Limpa os campos após o cadastro
    formulario.reset();
});
