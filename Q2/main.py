from mensagem_do_dia import request_mensagem_do_dia, escolhe_bicho
from flask import Flask, jsonify, request, render_template
from pyngrok import ngrok

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/api/mensagem-do-dia', methods=['GET'])
def mensagem_do_dia():
    data_de_nascimento = request.args.get('data_nascimento')

    if data_de_nascimento:
        mensagem = request_mensagem_do_dia(data_nascimento=data_de_nascimento)
        return mensagem
    else:
        return "Por favor, forneça a data de nascimento como parâmetro na URL."
    
@app.route('/api/bicho-da-sorte', methods=['GET'])
def bicho_da_sorte():
    data_de_nascimento = request.args.get('data_nascimento')

    if data_de_nascimento:
        bicho = escolhe_bicho(data_nascimento=data_de_nascimento)
        return bicho
    else:
        return "Por favor, forneça a data de nascimento como parâmetro na URL."

if __name__ == '__main__':
    ngrok.set_auth_token("2QCXI66cGnJe6z1kX14lLz9FPhj_279vjFbJ8bJMGUr46AsGC")
    http_tunnel = ngrok.connect(5000)
    print("Public URL:", http_tunnel.public_url)
    app.run()
