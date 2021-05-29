from config import *
from modelo import Pessoa

@app.route("/")
def inicio():
    return 'Sistema de Cadastro de Pessoas. ' +\
        '<a href="/listar_pessoa">Operação listar</a>'

@app.route("/listar_pessoa")
def listar_pessoa():
    # obter as pessoas do cadastro
    pessoa = db.session.query(Pessoa).all()
    # aplicar o método json que a classe Pessoa possui a cada elemento da lista
    pessoa_em_json = [x.json() for x in pessoa]
    # converter a lista do python para json
    resposta = jsonify(pessoa_em_json)
    # PERMITIR resposta para outras pedidos oriundos de outras tecnologias
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route("/pesquisar", methods=['GET'])
def pesquisar():
    dado = request.get_json()
    try:  # tentar pesquisar
        pesquisa = db.session.query(Pessoa).filter(Pessoa.nome == dado)
        pesquisa_em_json = [x.json() for x in pesquisa]
        resposta = jsonify(pesquisa_em_json)
        return resposta
    except Exception as e:  # em caso de erro...
        # informar mensagem de erro
        resposta = jsonify({"resultado": "erro", "detalhes": str(e)})
        # adicionar cabeçalho de liberação de origem
        resposta.headers.add("Access-Control-Allow-Origin", "*")
        return resposta

@app.route("/incluir_pessoa", methods=['post'])
def incluir_pessoa():
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    # receber as informações da nova Pessoa
    dados = request.get_json()
    try:  # tentar executar a operação
        novo = Pessoa(**dados)  # criar a nova pessoa
        db.session.add(novo)  # adicionar no BD
        db.session.commit()  # efetivar a operação de gravação
    except Exception as e:  # em caso de erro...
        # informar mensagem de erro
        resposta = jsonify({"resultado": "erro", "detalhes": str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route("/excluir_pessoa/<int:pessoa_id>", methods=['DELETE'])
def excluir_pessoa(pessoa_id):
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    try:
        # excluir a pessoa do ID informado
        Pessoa.query.filter(Pessoa.id == pessoa_id).delete()
        # confirmar a exclusão
        db.session.commit()
    except Exception as e:
        # informar mensagem de erro
        resposta = jsonify({"resultado": "erro", "detalhes": str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route("/alterar_pessoa/<int:pessoa_id>", methods=['PUT'])
def alterar_pessoa(pessoa_id):
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})

    dadosNovos = request.get_json()
    try:
        # excluir a pessoa do ID informado
        pessoaAlterada = Pessoa.query.filter(Pessoa.id == pessoa_id)

        pessoaAlterada.nome = dadosNovos.nome
        pessoaAlterada.dataNascimento = dadosNovos.dataNascimento
        pessoaAlterada.email = dadosNovos.email
        # confirmar a mudança
        db.session.commit()
    except Exception as e:
        # informar mensagem de erro
        resposta = jsonify({"resultado": "erro", "detalhes": str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta


app.run(debug=True)
