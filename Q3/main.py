from flask import Flask, jsonify, request, render_template
from pyngrok import ngrok
import requests

# Inicializa a aplicação Flask
app = Flask(__name__)

dollares = 0
wallets = []

coins = []

def converter_usd_to_crypto(usd, crypto):
    return usd / crypto

def converter_crypto_to_usd(valor_btc, preco_btc):
    return valor_btc * preco_btc

def converter_crypto_to_crypto(valor_origem, preco_origem, preco_destino):
    valor_em_usd = valor_origem * preco_origem  # Convertendo para dólares
    valor_em_destino = valor_em_usd / preco_destino  # Convertendo de dólares para a criptomoeda destino
    return valor_em_destino

def find_item_by_symbol(symbol, data_list):
    for item in data_list:
        if item.get("symbol") == symbol:
            return item
    return None

# CriptoMoedas
@app.route('/cryptos', methods=['GET'])
def get_cryptos():
    global coins
    if not coins:
        response = requests.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
        data = response.json()
        coins = data  # A resposta já é um JSON, não precisamos chamar jsonify aqui
        return coins
    else:
        return coins

@app.route('/addCrypto', methods=['POST'])
def add_crypto():
    global coins
    if request.is_json:
        data = request.get_json()  # {"name": "Bitcoin", "symbol": "BTC"}
        print(data)
        symbol = data.get('symbol')
        if not symbol:
            return jsonify({'message': 'Symbol is required in JSON data'}), 400
        
        # Procurando a criptomoeda na lista de todas as criptomoedas
        crypto_info = find_item_by_symbol(symbol, coins)
        
        if not crypto_info:
            return jsonify({'message': 'Cryptocurrency not found'}), 404
        
        for wallet_crypto in wallets:
            if wallet_crypto['symbol'] == symbol:
                return jsonify({'message': 'Cryptocurrency already added'}), 400
        
        crypto_info["money"] = 0
        # Adicionando a criptomoeda à lista de carteiras
        wallets.append(crypto_info)
        return jsonify({'message': 'Cryptocurrency added successfully!'}), 201
    else:
        return jsonify({'message': 'Request must be JSON'}), 400
    
@app.route('/transferirCrypto', methods=['POST'])
def transferir_dollares():
    global dollares
    if request.is_json:
        data = request.get_json()  # {"symbol": "Bitcoin", "symbol2": "BTC", amount: '10'}
        symbol = data.get('symbol')
        symbol2 = data.get('symbol2')
        amount = data.get('amount')
        print(data)
        if not amount:
            return jsonify({'message': 'Value is required in JSON data'}), 400
        if symbol == symbol2:
            return jsonify({'message': 'Cryptocurrency cannot be the same'}), 400
        
        if symbol == "dollar":
            cryptoReceiver = find_item_by_symbol(symbol2, coins)
            if not cryptoReceiver:
                return jsonify({'message': 'Cryptocurrency not found'}), 404
            dollares -= amount
            cryptoReceiver['money'] += converter_usd_to_crypto(amount, cryptoReceiver['current_price'])
            return jsonify({'message': 'Dollar transfered successfully!'}), 201
        
        if symbol2 == "dollar":
            cryptoSender = find_item_by_symbol(symbol, coins)
            if not cryptoSender:
                return jsonify({'message': 'Cryptocurrency not found'}), 404
            dollares += converter_crypto_to_usd(amount, cryptoSender['current_price'])
            cryptoSender['money'] -= amount
            return jsonify({'message': 'Dollar transfered successfully!'}), 201

        cryptoSender = find_item_by_symbol(symbol, coins)
        cryptoReceiver = find_item_by_symbol(symbol2, coins)
        if not cryptoSender or not cryptoReceiver:
            return jsonify({'message': 'Cryptocurrency not found'}), 404
        
        if amount > cryptoSender['money']:
            return jsonify({'message': 'Insufficient funds'}), 400
        
        cryptoSender['money'] -= amount
        cryptoReceiver['money'] += converter_crypto_to_crypto(amount, cryptoSender['current_price'], cryptoReceiver['current_price'])
    
        return jsonify({'message': 'Dollar transfered successfully!'}), 201
    else:
        return jsonify({'message': 'Request must be JSON'}), 400

@app.route('/addDolar', methods=['POST'])
def add_dolar():
    global dollares
    if request.is_json:
        data = request.get_json()  # {"value": 10.0}
        value = float(data.get('value'))
        if not value:
            return jsonify({'message': 'Value is required in JSON data'}), 400
        dollares += value
        return jsonify({'message': 'Dolar added successfully!'}), 201

@app.route('/dollars', methods=['GET'])
def get_dollars():
    global dollares
    return { 'money': dollares }

@app.route('/wallets', methods=['GET'])
def get_wallets():
    return jsonify(wallets)

# Endpoint para servir o arquivo index.html
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# Inicia o túnel ngrok e executa a aplicação
if __name__ == "__main__":
    ngrok.set_auth_token("2QCXI66cGnJe6z1kX14lLz9FPhj_279vjFbJ8bJMGUr46AsGC")
    http_tunnel = ngrok.connect(5000)
    print("Public URL:", http_tunnel.public_url)
    app.run()
    #app.run(host='0.0.0.0', port='5000', debug=True)
