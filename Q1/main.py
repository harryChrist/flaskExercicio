import requests
import json

x = requests.get('https://v6.exchangerate-api.com/v6/6f0550485af05a1797f44f0f/latest/USD')

data = json.loads(x.text)

json = data["conversion_rates"]

print("As taxas de conversão para 1 dólar americano são:")

for i in json:
  if i == "BRL" or i == "EUR" or i == "JPY":
    x = json.get(i)
    print (i, ":",round(x,2))