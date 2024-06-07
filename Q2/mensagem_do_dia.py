import os
import json
import random
import openai

openai.api_key = "sua api aqui"

# Lista de bichos
bichos = ["Abelha", "Anta", "Baleia", "Borboleta", "Cachorro", "Cavalo", "Dromedário", "Doninha", "Elefante", "Esquilo", "Foca", "Formiga", "Gato", "Girafa", "Hipopótamo", "Hiena", "Iguana", "Íbis", "Jacaré", "Javali", "Kanguru", "Koala", "Leão", "Leopardo", "Macaco", "Morcego", "Naja", "Narval", "Orangotango", "Onça", "Panda", "Pato", "Quati", "Quero-quero", "Raposa", "Rato", "Sapo", "Sagui", "Tatu", "Tigre", "Urso", "Urutu", "Veado", "Vaca", "Xexéu", "Xenops", "Zebra", "Zebu"]

def calcular_signo(data_nascimento):
    dia, mes, ano = map(int, data_nascimento.split('/'))

    if (mes == 3 and dia >= 20) or (mes == 4 and dia <= 20):
        return "Áries"
    elif (mes == 4 and dia >= 21) or (mes == 5 and dia <= 20):
        return "Touro"
    elif (mes == 5 and dia >= 21) or (mes == 6 and dia <= 20):
        return "Gêmeos"
    elif (mes == 6 and dia >= 21) or (mes == 7 and dia <= 21):
        return "Câncer"
    elif (mes == 7 and dia >= 22) or (mes == 8 and dia <= 22):
        return "Leão"
    elif (mes == 8 and dia >= 23) or (mes == 9 and dia <= 22):
        return "Virgem"
    elif (mes == 9 and dia >= 23) or (mes == 10 and dia <= 22):
        return "Libra"
    elif (mes == 10 and dia >= 23) or (mes == 11 and dia <= 21):
        return "Escorpião"
    elif (mes == 11 and dia >= 22) or (mes == 12 and dia <= 21):
        return "Sagitário"
    elif (mes == 12 and dia >= 22) or (mes == 1 and dia <= 21):
        return "Capricórnio"
    elif (mes == 1 and dia >= 21) or (mes == 2 and dia <= 18):
        return "Aquário"
    elif (mes == 2 and dia >= 19) or (mes == 3 and dia <= 19):
        return "Peixes"
    else:
        return "Signo não suportado."

def escolhe_bicho(data_nascimento):
    dia, mes, ano = map(int, data_nascimento.split('/'))

    if dia > 27:
        return random.choice(bichos)
    
    letra = chr(ord('A') + dia - 1)
    bichos_filtrados = [bicho for bicho in bichos if bicho.startswith(letra)]
    
    if not bichos_filtrados:
        return random.choice(bichos)
    
    return random.choice(bichos_filtrados)

import openai
import json

def request_mensagem_do_dia(data_nascimento):
    
    # Calcular o signo com base na data de nascimento
    print(data_nascimento)
    signo = calcular_signo(data_nascimento)

    # Montar o prompt em formato JSON
    prompt = {
        "data-de-nascimento": data_nascimento,
        "signo": signo,
        "mensagem": "Informe em JSON a Mensagem do Dia específica para o signo baseado na data de aniversário."
    }

    # Solicita a mensagem do dia
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Você é a porra de um Astrólogo, e fornecerá uma mensagem do dia especifica para o signo baseado na data de aniversário"
            },
            {
                "role": "user",
                "content": "data-de-nascimento: " + data_nascimento + "\nsigno: " + signo + " ai salvará: {data-de-nascimento, signo, mensagem} "
            }
        ],
        max_tokens=300
    )

    # Obtém o conteúdo da mensagem
    message_content = response.choices[0].message.content

    return message_content
