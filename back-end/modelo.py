from config import *

class Pessoa(db.Model):
    # atributos da pessoa
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(254))
    dataNascimento = db.Column(db.String(254))
    email = db.Column(db.String(254))

    # método para expressar a pessoa em forma de texto
    def __str__(self):
        return self.nome + ", " + self.dataNascimento + ", " + self.email
    # expressao da classe no formato json

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "dataNascimento": self.dataNascimento,
            "email": self.email
        }

#          <===========================    TESTES    ===========================>

if __name__ == "__main__":
    # apagar o arquivo, se houver
    if os.path.exists(arquivobd):
        os.remove(arquivobd)

    # criar tabelas
    db.create_all()

    # teste da classe Pessoa
    pessoa1 = Pessoa(nome="Priscila Lemke", dataNascimento="05/02/2003",
                     email="priscila523lemke@gmail.com")
    pessoa2 = Pessoa(nome="Pedro Schumann", dataNascimento="31/03/2003",
                     email="pedroschumann2016@gmail.com")
    # persistir
    db.session.add(pessoa1)
    db.session.add(pessoa2)
    db.session.commit()

    print(f"Pessoa: {pessoa2}")  # exibir a pessoa
    # exibir a pessoa no formato json
    print(f"Pessoa em json: {pessoa2.json()} ")
