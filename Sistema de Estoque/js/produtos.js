
/* =========================================
   1. DADOS E ELEMENTOS DO HTML
========================================= */

// Recupera os produtos salvos no navegador.
// Se ainda não houver dados, utiliza um array vazio.
const produtos = JSON.parse(
    localStorage.getItem("estoque_produtos")
) || [];

// Calcula o próximo ID com base nos produtos existentes.
let proximoId = produtos.reduce(function (maiorId, produto) {
    return Math.max(maiorId, produto.id);
}, 0) + 1;

// null: cadastrando um produto novo.
// Número: editando o produto com esse ID.
let idEmEdicao = null;

// Elementos da página.
const formulario = document.querySelector("#form-produto");
const corpoTabela = document.querySelector("#products-table-body");
const contadorProdutos = document.querySelector("#products-count");

const botaoSalvar = formulario.querySelector('button[type="submit"]');
const botaoLimpar = formulario.querySelector('button[type="reset"]');


/* =========================================
   2. SALVAR PRODUTOS NO LOCALSTORAGE
========================================= */

function salvarProdutos() {

    localStorage.setItem(
        "estoque_produtos",
        JSON.stringify(produtos)
    );

}


/* =========================================
   3. EXIBIR OS PRODUTOS NA TABELA
========================================= */

function renderizarProdutos() {

    // Remove as linhas anteriores da tabela.
    corpoTabela.replaceChildren();

    // Atualiza o contador.
    const quantidadeProdutos = produtos.length;

    contadorProdutos.textContent =
        `${quantidadeProdutos} ${quantidadeProdutos === 1 ? "produto" : "produtos"}`;

    // Exibe uma mensagem quando não há produtos.
    if (quantidadeProdutos === 0) {

        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 6;
        celula.textContent = "Nenhum produto cadastrado.";

        linha.appendChild(celula);
        corpoTabela.appendChild(linha);

        return;
    }

    // Percorre o array e cria uma linha para cada produto.
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

        // Cria as cinco primeiras células da linha.
        dados.forEach(function (dado) {

            const celula = document.createElement("td");

            celula.textContent = dado;
            linha.appendChild(celula);

        });

        // Cria a célula dos botões Editar e Excluir.
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

        // Adiciona a linha completa à tabela.
        corpoTabela.appendChild(linha);

    });

}


/* =========================================
   4. CADASTRAR OU ATUALIZAR UM PRODUTO
========================================= */

formulario.addEventListener("submit", function (evento) {

    // Impede o recarregamento da página.
    evento.preventDefault();

    // Captura os valores preenchidos no formulário.
    const dadosProduto = {

        codigo: document.querySelector("#codigo").value.trim(),

        nome: document.querySelector("#nome").value.trim(),

        categoria: document.querySelector("#categoria").value.trim(),

        quantidade: Number(
            document.querySelector("#quantidade").value
        ),

        preco: Number(
            document.querySelector("#preco").value
        ),

        estoqueMinimo: Number(
            document.querySelector("#estoque-minimo").value
        )

    };

    // Impede que dois produtos tenham o mesmo código.
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

    // Se não estamos editando, cadastra um novo produto.
    if (idEmEdicao === null) {

        const novoProduto = {
            id: proximoId,
            ...dadosProduto
        };

        produtos.push(novoProduto);

        proximoId++;

    } else {

        // Se estamos editando, atualiza o produto existente.
        const produto = produtos.find(function (produto) {
            return produto.id === idEmEdicao;
        });

        if (produto) {
            Object.assign(produto, dadosProduto);
        }

    }

    // NOVO: salva os dados atualizados no navegador.
    salvarProdutos();

    // Atualiza a tabela e limpa o formulário.
    renderizarProdutos();

    formulario.reset();

});


/* =========================================
   5. EDITAR OU EXCLUIR UM PRODUTO
========================================= */

corpoTabela.addEventListener("click", function (evento) {

    // Identifica qual botão da tabela foi clicado.
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    // Localiza o produto correspondente ao botão.
    const produto = produtos.find(function (produto) {
        return produto.id === id;
    });

    if (!produto) {
        return;
    }


    /* -------- EDITAR -------- */

    if (acao === "editar") {

        // Preenche o formulário com os dados do produto.
        document.querySelector("#codigo").value = produto.codigo;

        document.querySelector("#nome").value = produto.nome;

        document.querySelector("#categoria").value = produto.categoria;

        document.querySelector("#quantidade").value = produto.quantidade;

        document.querySelector("#preco").value = produto.preco;

        document.querySelector("#estoque-minimo").value =
            produto.estoqueMinimo;

        // Ativa o modo de edição.
        idEmEdicao = produto.id;

        botaoSalvar.textContent = "Salvar alterações";
        botaoLimpar.textContent = "Cancelar edição";

        // Leva o usuário até o formulário.
        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* -------- EXCLUIR -------- */

    if (acao === "excluir") {

        const confirmar = confirm(
            `Deseja realmente excluir o produto "${produto.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        // Encontra a posição do produto no array.
        const indice = produtos.findIndex(function (item) {
            return item.id === id;
        });

        if (indice !== -1) {

            // Remove o produto do array.
            produtos.splice(indice, 1);

            // NOVO: salva o array após a exclusão.
            salvarProdutos();

        }

        // Cancela a edição caso o produto excluído
        // estivesse aberto no formulário.
        if (idEmEdicao === id) {
            formulario.reset();
        }

        // Atualiza a tabela.
        renderizarProdutos();

    }

});


/* =========================================
   6. LIMPAR O FORMULÁRIO
========================================= */

formulario.addEventListener("reset", function () {

    // Retorna ao modo de cadastro.
    idEmEdicao = null;

    botaoSalvar.textContent = "Cadastrar produto";
    botaoLimpar.textContent = "Limpar";

});


/* =========================================
   7. EXIBIÇÃO INICIAL
========================================= */

// Mostra na tabela os produtos recuperados do localStorage.
renderizarProdutos();



