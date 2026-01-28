import { useState, useEffect, useContext } from 'react';
import { MotoContext } from '../context/MotoContext';
import { sendChatMessage } from '../context/Chatbot.js';

export const useChat = () => {
    const { motos, cadastrarMoto, listar_motos } = useContext(MotoContext);
    const [messages, setMessages] = useState([]);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [motoSelecionada, setMotoSelecionada] = useState(null);
    const [carregandoMotos, setCarregandoMotos] = useState(false); // Comece como false

    useEffect(() => {
    let ativo = true; // Controle para evitar atualizar estado se o componente desmontar

    const inicializar = async () => {
        setCarregandoMotos(true);
        try {
            // 1. Tenta listar as motos
            const listaAtual = await listar_motos();
            //Retirei a criação automática da moto padrão
        } catch (error) {
            console.error("Erro na inicialização:", error);
        } finally {
            if (ativo) setCarregandoMotos(false);
        }
    };

    inicializar();

    return () => { ativo = false; }; // Cleanup function
}, []); // Array de dependências vazio para rodar só uma vez

    const enviarMensagem = async (texto) => {
        if (!texto || texto.trim() === "" || !motoSelecionada) return;

        const userMsg = { text: texto, isBot: false };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoadingChat(true);

        try {
            const usuarioId = 1; 
            const data = await sendChatMessage(texto, usuarioId, motoSelecionada.id);
            
            const botMsg = { text: data.resposta, isBot: true };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { text: "Erro ao processar resposta.", isBot: true }]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const trocarMoto = () => {
        setMotoSelecionada(null);
        setMessages([]); 
    };

    return {
        motos,
        motoSelecionada,
        setMotoSelecionada,
        messages,
        isLoadingChat,
        carregandoMotos,
        enviarMensagem,
        trocarMoto
    };
};