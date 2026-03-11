import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }

  // Retornamos tudo que a UI precisa para funcionar
  return {
    motos: context.motos,
    motoSelecionada: context.motoSelecionada,
    setMotoSelecionada: context.setMotoSelecionada,
    messages: context.messages,
    enviarMensagem: context.enviarMensagem,
    isLoadingChat: context.isLoadingChat,
    limparChat: context.limparChat,
    trocarMoto: context.trocarMoto,
    erro: context.erro,
  };
};
