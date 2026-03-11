# Importa as classes dos arquivos individuais
from .empresa_model import Empresa
from .cargo_model import Cargo
from .user_model import User
from .moto_model import Moto
from .chat_model import ChatLog # Mudou de Chat para ChatLog
from .notification_model import Notification
from .report_model import Report
from .peca_model import Peca

# (Opcional) Define o que será exportado se alguém usar "from app.models import *"
__all__ = ["Empresa", "Cargo", "User", "Moto", "ChatLog", "Notification", "Report", "Peca"]
