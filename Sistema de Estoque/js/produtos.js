
/* =========================================
   1. DADOS E ELEMENTOS DO HTML
========================================= */

// Produtos cadastrados durante o uso da página
const produtos = [];

// Identificador único para cada produto
let proximoId = 1;

// Indica qual produto está sendo editado.
// null significa que estamos cadastrando um novo produto.
let idEmEdicao = null;

const formulario = document.querySelector("#form-produto");
const corpoTabela = document.querySelector("#products-table-body");
const contadorProdutos = document.querySelector("#products-count");

const botaoSalvar = formulario.querySelector('button[type="submit"]');
const botaoLimpar = formulario.querySelector('button[type="reset"]');


/* =========================================
   2. EXIBIR OS PRODUTOS NA TABELA
========================================= */

function renderizarProdutos() {

    corpoTabela.replaceChildren();

    const quantidadeProdutos = produtos.length;

    contadorProdutos.textContent =
        `${quantidadeProdutos} ${quantidadeProdutos === 1 ? "produto" : "produtos"}`;

    if (quantidadeProdutos === 0) {

        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 6;
        celula.textContent = "Nenhum produto cadastrado.";

        linha.appendChild(celula);
        corpoTabela.appendChild(linha);

        return;
    }

    produtos.forEach(function (produto) {

        const linha = document.createElement("tr");

        const dados = [
            produto.codigo,
            produto.nome,
            produto.categoria,
            produto.quantidade,
            produto.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        ];

        // Preenche as cinco primeiras colunas
        dados.forEach(function (dado) {

            const celula = document.createElement("td");

            celula.textContent = dado;
            linha.appendChild(celula);

        });

        // Sexta coluna: ações
        const celulaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-secondary";

        botaoEditar.dataset.acao = "editar";
        botaoEditar.dataset.id = produto.id;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-danger";

        botaoExcluir.dataset.acao = "excluir";
        botaoExcluir.dataset.id = produto.id;

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaAcoes);
        corpoTabela.appendChild(linha);

    });
}


/* =========================================
   3. CADASTRAR OU ATUALIZAR UM PRODUTO
========================================= */

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    // Obtém os dados preenchidos no formulário
    const dadosProduto = {
        codigo: document.querySelector("#codigo").value.trim(),
        nome: document.querySelector("#nome").value.trim(),
        categoria: document.querySelector("#categoria").value.trim(),
        quantidade: Number(document.querySelector("#quantidade").value),
        preco: Number(document.querySelector("#preco").value),
        estoqueMinimo: Number(document.querySelector("#estoque-minimo").value)
    };

    // Verifica se o código já pertence a outro produto
    const codigoDuplicado = produtos.some(function (produto) {

        return (
            produto.codigo === dadosProduto.codigo &&
            produto.id !== idEmEdicao
        );

    });

    if (codigoDuplicado) {
        alert("Já existe um produto cadastrado com esse código.");
        return;
    }

    if (idEmEdicao === null) {

        // CADASTRO: cria um produto com identificador único
        const novoProduto = {
            id: proximoId,
            ...dadosProduto
        };

        produtos.push(novoProduto);

        proximoId++;

    } else {

        // EDIÇÃO: encontra e atualiza o produto existente
        const produto = produtos.find(function (produto) {
            return produto.id === idEmEdicao;
        });

        if (produto) {
            Object.assign(produto, dadosProduto);
        }

    }

    renderizarProdutos();

    formulario.reset();

});


/* =========================================
   4. EDITAR OU EXCLUIR PELA TABELA
========================================= */

corpoTabela.addEventListener("click", function (evento) {

    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    const produto = produtos.find(function (produto) {
        return produto.id === id;
    });

    if (!produto) {
        return;
    }

    // EDITAR
    if (acao === "editar") {

        // Preenche o formulário com os dados atuais
        document.querySelector("#codigo").value = produto.codigo;
        document.querySelector("#nome").value = produto.nome;
        document.querySelector("#categoria").value = produto.categoria;
        document.querySelector("#quantidade").value = produto.quantidade;
        document.querySelector("#preco").value = produto.preco;
        document.querySelector("#estoque-minimo").value = produto.estoqueMinimo;

        idEmEdicao = produto.id;

        botaoSalvar.textContent = "Salvar alterações";
        botaoLimpar.textContent = "Cancelar edição";

        // Leva o usuário até o formulário
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // EXCLUIR
    if (acao === "excluir") {

        const confirmar = confirm(
            `Deseja realmente excluir o produto "${produto.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        const indice = produtos.findIndex(function (item) {
            return item.id === id;
        });

        if (indice !== -1) {
            produtos.splice(indice, 1);
        }

        // Se o produto excluído estava em edição, cancela a edição
        if (idEmEdicao === id) {
            formulario.reset();
        }

        renderizarProdutos();
    }

});


/* =========================================
   5. LIMPAR O FORMULÁRIO
========================================= */

formulario.addEventListener("reset", function () {

    idEmEdicao = null;

    botaoSalvar.textContent = "Cadastrar produto";
    botaoLimpar.textContent = "Limpar";

});


/* =========================================
   6. EXIBIÇÃO INICIAL
========================================= */

renderizarProdutos();


