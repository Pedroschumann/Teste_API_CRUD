$(function () { // quando o documento estiver pronto/carregado

    function mostrar_conteudo(identificador) {
        // esconde todos os conteúdos
        $("#cadastroPessoa").addClass('d-none');
        $("#conteudoInicial").addClass('d-none');
        // torna o conteúdo escolhido visível
        $("#" + identificador).removeClass('d-none');
    }

    // código para mapear click do link Inicio
    $(document).on("click", "#linkInicio", function () {
        mostrar_conteudo("conteudoInicial");
    });

    //================================================================== EXIBIR LISTA DE PESSOA ==================================================================

    function exibir_pessoa() {
        $.ajax({
            url: 'http://localhost:5000/listar_pessoa',
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            success: listar, // chama a função listar para processar o resultado
            error: function (problema) {
                alert("erro ao ler dados, verifique o backend: ");
            }
        });
        function listar(pessoa) {
            // esvaziar o corpo da tabela
            $('#corpoTabelaPessoa').empty();
            // tornar visível a página de pessoas
            mostrar_conteudo("cadastroPessoa");
            // percorrer a lista de pessoas retornadas; 
            for (var i in pessoa) { //i vale a posição no vetor
                lin = '<tr id="linha_' + pessoa[i].id + '">' +
                    '<td>' + pessoa[i].nome + '</td>' +
                    '<td>' + pessoa[i].dataNascimento + '</td>' +
                    '<td>' + pessoa[i].email + '</td>' +
                    '<td><a href=# id="excluir_' + pessoa[i].id + '" ' +
                    'class="excluir_pessoa"><img src="img/excluir.png" ' +
                    'alt="Excluir pessoa" title="Excluir pessoa"></a>' +
                    '</td>' +
                    '<td><a class="nav-item nav-link"' + pessoa[i].id + 'data-toggle="modal"' +
                    'data-target="#modalAlterarPessoa" href="#">' +
                    '<img src="img/alterar.png" title="Alterar pessoa"></a>' +
                    '</td>' +
                    '</tr>';
                // adiciona a linha no corpo da tabela
                $('#corpoTabelaPessoa').append(lin);
            }
        }
    }

    $(document).on("click", "#linkListarPessoa", function () {
        exibir_pessoa();
    });

    //================================================================== EXIBIR PESSOAS PESQUISADAS ==================================================================

    // código para mapear click do botão pesquisar pessoa
    $(document).on("click", "#btPesquisarPessoa", function () {
        //pegar dados da tela
        nomePesquisado = $("#campoNomePesquisado").val();
        // preparar dados no formato json
        var dado = JSON.stringify({ nomePesquisado: nomePesquisado });
        // fazer requisição para o back-end
        $.ajax({
            url: 'http://localhost:5000/pesquisar',
            type: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dado, // estes são os dados enviados
            success: pesquisado, // chama a função listar para processar o resultado
            error: function (problema) {
                alert("erro ao ler dados, verifique o backend: ");
            }
        });
        function pesquisado(pesquisa) {
            // esvaziar o corpo da tabela
            $('#corpoTabelaPesquisa').empty();
            mostrar_conteudo("cadastroPessoa");
            for (var i in pesquisa) { //i vale a posição no vetor
                linha = '<tr id="linha_' + pesquisa[i].id + '">' +
                    '<td>' + pesquisa[i].nome + '</td>' +
                    '<td>' + pesquisa[i].dataNascimentos + '</td>' +
                    '<td>' + pesquisa[i].email + '</td>' +
                    '<td><a href=# id="excluir_' + pesquisa[i].id + '" ' +
                    'class="excluir_pessoa"><img src="img/excluir.png" ' +
                    'alt="Excluir pessoa" title="Excluir pessoa"></a>' +
                    '</td>' +
                    '<td><a class="nav-item nav-link"' + pesquisa[i].id + 'data-toggle="modal"' +
                    'data-target="#modalAlterarPessoa" href="#">' +
                    '<img src="img/alterar.png" title="Alterar pessoa"></a>' +
                    '</td>' +
                    '</tr>';
                // adiciona a linha no corpo da tabela
                $('#corpoTabelaPessoas').append(linha);
            }
        };
    });
    $('#modalPesquisarPessoa').on('hide.bs.modal', function (e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroPessoa").hasClass('invisible')) {
            exibir_pessoa();
        }
    });

    //================================================================== INCLUIR PESSOA ==================================================================

    // código para mapear click do botão incluir pessoa
    $(document).on("click", "#btIncluirPessoa", function () {
        //pegar dados da tela
        nome = $("#campoNome").val();
        dataNascimento = $("#campoDataNascimento").val();
        email = $("#campoEmail").val();

        // preparar dados no formato json
        var dados = JSON.stringify({ nome: nome, dataNascimento: dataNascimento, email: email });
        // fazer requisição para o back-end
        $.ajax({
            url: 'http://localhost:5000/incluir_pessoa',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: pessoaIncluido, // chama a função listar para processar o resultado
            error: erroAoIncluir
        });
        function pessoaIncluido(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // informar resultado de sucesso
                alert("Pessoa incluída com sucesso!");
                // limpar os campos
                $("#campoNome").val("");
                $("#campoDataNascimento").val("");
                $("#campoEmail").val("");
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }
        function erroAoIncluir(retorno) {
            // informar mensagem de erro
            alert("erro ao incluir dados, verifique o backend: ");
        }
    });

    // código a ser executado quando a janela de inclusão de pessoas for fechada
    $('#modalIncluirPessoa').on('hide.bs.modal', function (e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroPessoa").hasClass('invisible')) {
            // atualizar a página de listagem
            exibir_pessoa();
        }
    });

    mostrar_conteudo("conteudoInicial");

    //================================================================== EXCLUIR PESSOA ==================================================================

    // código para os ícones de excluir pessoas (classe css)
    $(document).on("click", ".excluir_pessoa", function () {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da pessoa
        var nome_icone = "excluir_";
        var id_pessoa = componente_clicado.substring(nome_icone.length);
        // solicitar a exclusão da pessoa
        $.ajax({
            url: 'http://localhost:5000/excluir_pessoa/' + id_pessoa,
            type: 'DELETE', // método da requisição
            dataType: 'json', // os dados são recebidos no formato json
            success: pessoaExcluida, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });
        function pessoaExcluida(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // remover da tela a linha cuja pessoa foi excluída
                $("#linha_" + id_pessoa).fadeOut(1000, function () {
                    // informar resultado de sucesso
                    alert("Pessoa removida com sucesso!");
                });
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }
        function erroAoExcluir(retorno) {
            // informar mensagem de erro
            alert("erro ao excluir dados, verifique o backend: ");
        }
    });



    //================================================================== ALTERAR PESSOA ==================================================================


    // código para os ícones de excluir pessoas (classe css)
    $(document).on("click", "#btAlterar_pessoa", function () {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da pessoa
        var nome_icone = "alterar_";
        var id_pessoa = componente_clicado.substring(nome_icone.length);

        nome = $("#campoNome").val();
        dataNascimento = $("#campoDataNascimento").val();
        email = $("#campoEmail").val();

        // preparar dados no formato json
        var dadosNovos = JSON.stringify({ nome: nome, dataNascimento: dataNascimento, email: email });
        // solicitar a alteração da pessoa
        $.ajax({
            url: 'http://localhost:5000/alterar_pessoa/' + id_pessoa,
            type: 'PUT', // método da requisição
            dataType: 'json', // os dados são recebidos no formato json
            data: dadosNovos, // estes são os dados enviados
            success: pessoaAlterada, // chama a função listar para processar o resultado
            error: erroAoAlterar
        });
        function pessoaAlterada(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // informar mensagem de sucesso
                alert("Pessoa alterada com sucesso!");

            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }
        function erroAoAlterar(retorno) {
            // informar mensagem de erro
            alert("erro ao alterar dados, verifique o backend: ");
        }
    });
    // código a ser executado quando a janela de alteração de pessoas for fechada
    $('#modalAlterarPessoa').on('hide.bs.modal', function (e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroPessoa").hasClass('invisible')) {
            // atualizar a página de listagem
            exibir_pessoa();
        }
    });
});

