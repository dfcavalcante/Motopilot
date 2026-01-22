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
    const [carregandoMotos, setCarregandoMotos] = useState(true);

    useEffect(() => {
        const inicializar = async () => {
            setCarregandoMotos(true);
            
            try {
                const listaAtual = await listar_motos(); 
                
                const quantidadeMotos = listaAtual ? listaAtual.length : 0;

                if (quantidadeMotos === 0) { 
                    console.log("Nenhuma moto encontrada. Criando padrões...");
                    
                    const blob = new Blob(["Manual Pendente"], { type: 'application/pdf' });
                    const arquivoFake = new File([blob], "manual_padrao.pdf", { type: "application/pdf" });

                    for (const moto of MOTOS_PADRAO) {
                        const formData = new FormData();
                        formData.append('marca', moto.marca);
                        formData.append('modelo', moto.modelo);
                        formData.append('ano', moto.ano);
                        formData.append('documento_pdf', arquivoFake); 
                        
                        await cadastrarMoto(formData); 
                    }
                    await listar_motos();
                }
            } catch (error) {
                console.error("Erro ao inicializar chat:", error);
            } finally {
                setCarregandoMotos(false);
            }
        };
        inicializar();
    }, []); 

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