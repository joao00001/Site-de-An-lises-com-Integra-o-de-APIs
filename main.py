import openai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Instância principal da aplicação FastAPI
app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

# Configuração da API Key (garanta que está correta e segura)
openai.api_key = 'adicione sua chave aqui'
# Verificação da chave da API

# Modelo de entrada para o chatbot
class Mensagem(BaseModel):
    texto: str

# Endpoint principal para teste
@app.get("/")
async def root():
    return {"message": "API está funcionando!"}

# Endpoint para o chatbot com comportamento de assistente
@app.post("/chat")
async def chat(mensagem: Mensagem):
    try:
        # Verificação de entrada vazia
        if not mensagem.texto.strip():
            return {"erro": "A mensagem não pode estar vazia."}

        # Chamada para a API OpenAI com o modelo de chat
        resposta = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Ou gpt-4, dependendo do que você deseja usar
            messages=[
                {"role": "system", "content": "Você é um assistente útil e amigável."},  # Comportamento do assistente
                {"role": "user", "content": mensagem.texto}
            ],
            max_tokens=150,
            temperature=0.7
        )

        # Retorna a resposta geradaaaaaaaaaaaaaa
        return {"resposta": resposta['choices'][0]['message']['content']}
    except openai.error.OpenAIError as e:
        return {"erro": f"Erro na API OpenAI: {str(e)}"}
    except Exception as e:
        return {"erro": f"Erro inesperado: {str(e)}"}