# 🏍️ MotoPilot

O **MotoPilot** é uma plataforma completa projetada para transformar o ecossistema de oficinas mecânicas. Ele atua sob dois pilares principais: um **Assistente Virtual Inteligente (IA)** focado na manutenção e treinamento de mecânicos de motos, e um **Sistema Integrado de Gestão**, que controla todo o fluxo de trabalho desde o cadastro do equipamento até a finalização do serviço.

---

## 🚀 Principais Funcionalidades

### 🤖 Inteligência Artificial (RAG Assistente)
*   **Chatbot Especialista:** Responde a dúvidas complexas de mecânica consultando os manuais em PDF oficiais dos modelos cadastrados.
*   **Geração Automática de Relatórios:** A IA interpreta as conversas entre o mecânico e a máquina para redigir sozinhas os **Relatórios Técnicos** com o diagnóstico, os serviços executados e as peças defeituosas.

### 📊 Sistema de Gestão e Administração
*   **Dashboard e Métricas:** Visão panorâmica sobre os atendimentos, número de modelos, eficiência e peças defeituosas recorrentes.
*   **Gestão de Estoque e Modelos:** Organização hierárquica entre "Modelos" de motocicletas e unidades individuais.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Python, FastAPI, SQLAlchemy
*   **Banco de Dados:** PostgreSQL para relacionais, ChromaDB para Banco de Dados Vetorial (IA)
*   **IA & RAG:** Integração com Ollama (Mistral), PyMuPDF4LLM para parse de PDFs e FlashRank para re-ranking inteligente de contexto.
*   **Frontend:** Vite, React, Material UI.

---

## ⚙️ Requisitos do Sistema

Antes de começar, certifique-se de ter os seguintes requisitos instalados na sua máquina:

1.  **Python:** `Ver. 3.10` ou **inferior** *(⚠️ Versões mais novas podem causar conflito com bibliotecas de vetorização e dependências nativas do RAG)*.
2.  **Node.js & npm** para a parte do Frontend.
3.  **PostgreSQL** rodando como serviço.
    *   **Importante:** Você precisará criar um banco de dados vazio **manualmente** (ex: `motopilot_db`) no seu PostgreSQL (via pgAdmin, DBeaver ou psql) antes de rodar a API. O sistema (FastAPI) apenas criará as **tabelas** automaticamente.
4.  **Ollama**: Instalado localmente com o modelo base ativado.
    *   No terminal do ollama, rode: `ollama pull mistral`

---

## 🖥️ Como Rodar a Aplicação

Siga o passo a passo abaixo para levantar as duas pontas da aplicação localmente.

### 1. Configurando o Backend (Python FastAPI)

1. Abra o terminal na pasta raiz do projeto e navegue até o backend:
   ```bash
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   
   # No Windows:
   .\venv\Scripts\activate
   # No Linux/Mac:
   source venv/bin/activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Crie o arquivo de variáveis de ambiente (`.env`) na raiz da pasta `backend` seguindo o modelo (se baseie nas configurações do `config.py`):
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=sua_senha_aqui
   POSTGRES_DB=motopilot_db
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   JWT_SECRET_KEY=sua_chave_secreta_aqui
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   LLM_MODEL_NAME=mistral
   ```
5. Inicie o servidor Backend:
   ```bash
   uvicorn app.main:app --reload
   ```
*Nota: A primeira vez que o backend for executado, os dados e modelos de Machine Learning (como FlashRank e os embeddings) serão baixados. Isso pode demorar alguns minutos.*

---

### 2. Configurando o Frontend (React / Vite)

1. Abra um segundo terminal na raiz do projeto e navegue até o app Web:
   ```bash
   cd frontend
   ```
2. Instale as dependências do Node:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 3. Criando o Primeiro Acesso (Admin/Gerente)

Como o sistema é de uso interno da oficina, não existe um botão de "cadastre-se" aberto ao público na tela de Login. 
Para criar o **primeiro acesso**, você utiliza a própria interface de documentação da API:

1. Com o backend rodando, acesse no seu navegador: `http://localhost:8000/docs`
2. Encontre e abra a rota **POST** `/users/`.
3. Clique no botão **Try it out**.
4. Substitua o texto pelo JSON com seus dados. Exemplo:
   ```json
   {
     "nome": "Admin Motopilot",
     "email": "admin@motopilot.com",
     "matricula": "ADMIN01",
     "funcao": "gerente",
     "senha": "admin"
   }
   ```
5. Clique em **Execute**.
6. Pronto! Agora basta acessar o Frontend no navegador (geralmente `http://localhost:5173`) e fazer login com o email e senha que você acabou de criar.
