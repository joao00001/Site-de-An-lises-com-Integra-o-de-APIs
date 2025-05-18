from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import json

app = Flask(__name__)
CORS(app)

def process_data(data):
    """
    Processa os dados recebidos, convertendo strings JSON em dicionários.
    """
    processed_data = []

    for entry in data:
        if isinstance(entry, str):
            try:
                # Substitui aspas simples por aspas duplas e converte para JSON
                entry = json.loads(entry.replace("'", '"'))
            except json.JSONDecodeError:
                raise ValueError(f"Erro ao decodificar string JSON: {entry}")

        if isinstance(entry, dict):
            processed_data.append(entry)
        else:
            raise ValueError(f"Formato inválido: {entry}")

    return processed_data


def restructure_data(data):
    """
    Reestrutura os dados para que cada chave única seja uma coluna,
    e seus valores sejam concatenados em uma única célula.
    """
    restructured = {}

    for entry in data:
        for key, value in entry.items():
            if key not in restructured:
                restructured[key] = []
            restructured[key].append(value)

    # Concatena os valores em uma única string, separados por vírgula
    return {key: ', '.join(map(str, values)) for key, values in restructured.items()}


def convert_to_csv(data, file_name):
    """
    Converte os dados para um arquivo CSV com uma única linha.
    """
    file_path = f'./{file_name}.csv'

    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        # Usa as chaves como cabeçalhos
        fieldnames = data.keys()
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerow(data)

    return file_path


@app.route('/save_data', methods=['POST'])
def save_data():
    """
    Endpoint para salvar dados recebidos em JSON como um arquivo CSV
    """
    data = request.json

    if not isinstance(data, list) or len(data) == 0:
        return jsonify({"error": "Os dados devem ser uma lista não vazia."}), 400

    try:
        # Processa os dados
        processed_data = process_data(data)

        # Reestrutura os dados para o formato desejado
        restructured_data = restructure_data(processed_data)

        # Define o nome do arquivo CSV
        file_name = 'dados_salvos'

        # Converte para CSV
        file_path = convert_to_csv(restructured_data, file_name)

        return jsonify({"message": "Dados salvos com sucesso!", "file": file_path}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor.", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
