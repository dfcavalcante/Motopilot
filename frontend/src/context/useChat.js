import { useState, useEffect, useContext } from 'react';
import { MotoContext } from '../context/MotoContext';
import { sendChatMessage } from '../context/Chatbot.js';

const MOTOS_PADRAO = [
    { marca: "Honda", modelo: "CG 160 Titan", ano: 2024 },
    { marca: "Yamaha", modelo: "Fazer 250", ano: 2023 },
    { marca: "BMW", modelo: "G 310 R", ano: 2022 }
];

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
            
            // 2. Se não houver motos, cadastra as padrões em sequência
            if (ativo && (!listaAtual || listaAtual.length === 0)) {
                console.log("Banco vazio. Criando motos padrão...");
                
                const blob = new Blob(["Manual Pendente"], { type: 'application/pdf' });
                const arquivoFake = new File([blob], "manual_padrao.pdf", { type: "application/pdf" });

                // Usamos for...of para garantir a ordem sequencial e evitar atropelo no banco
                for (const moto of MOTOS_PADRAO) {
                    const formData = new FormData();
                    formData.append('marca', moto.marca);
                    formData.append('modelo', moto.modelo);
                    formData.append('ano', moto.ano);
                    formData.append('documento_pdf', arquivoFake);
                    
                    await cadastrarMoto(formData); 
                }
                
                // 3. Após cadastrar todas, busca a lista atualizada final
                await listar_motos();
            }
        } catch (error) {
            console.error("Erro na inicialização:", error);
        } finally {
            // 4. Só desliga o loading aqui, no final de TUDO
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