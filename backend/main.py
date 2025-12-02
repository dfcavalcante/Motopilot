#.venv\Scripts\activate
#uvicorn main:app --reload

from fastapi import FastAPI
from config import Settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title = Settings.API_NAME,
    description= Settings.API_DESCRIPTION,
    version = Settings.API_VERSION
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8080"], #coloca todos os domínios que iremos utilizar
    allow_methods=["*"], #permite todos os comandos (put, delete, post, etc)
    allow_headers=["*"],
    allow_credentials=True
)

#Rotas - ainda não adicionei no caso
#app.include_router(auth_router.router)
#app.include_router(moto_router.router)
#app.include_router(diag_router.router)
#app.include_router(training_router.router)
#app.include_router(report_router.router)