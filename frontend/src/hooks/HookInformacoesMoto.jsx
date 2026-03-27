import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext.jsx';
import { MotoContext } from '../context/MotoContext.jsx';
import { UsersContext } from '../context/UserContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';
import { notify } from '../utils/toastConfig.jsx';

const normalizeRole = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const HookInformacoesMoto = ({ moto }) => {
  const navigate = useNavigate();
  const { iniciarNovoChat } = useContext(ChatContext);
  const { excluirMoto, atribuirMoto } = useContext(MotoContext);
  const { listarUsers } = useContext(UsersContext);
  const { user } = useLogin();

  const role = normalizeRole(user?.funcao);
  const canManageMoto =
    role === 'coordenador' ||
    role === 'coordenadora' ||
    role === 'gerente' ||
    role === 'administrador' ||
    role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [savingMecanico, setSavingMecanico] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);

  const mecanicoIdInicial = Number(moto?.mecanicoId ?? moto?.mecanico_id ?? 0) || '';
  const [mecanicoSelecionado, setMecanicoSelecionado] = useState(mecanicoIdInicial);
  const [mecanicoAtribuidoId, setMecanicoAtribuidoId] = useState(mecanicoIdInicial);

  const fallbackSrc = '/images/Motopilot.jpeg';
  const estadoAtualMoto = normalizeRole(moto?.estado);
  const motoConcluida = estadoAtualMoto === 'concluido' || estadoAtualMoto === 'concluida';

  useEffect(() => {
    setMecanicoSelecionado(mecanicoIdInicial);
    setMecanicoAtribuidoId(mecanicoIdInicial);
    setIsEditing(false);
  }, [moto?.id, mecanicoIdInicial]);

  useEffect(() => {
    const carregarTecnicos = async () => {
      const usuarios = await listarUsers();
      const listaTecnicos = (usuarios || []).filter((u) => {
        const funcao = normalizeRole(u?.funcao);
        return funcao === 'tecnico' || funcao === 'mecanico';
      });
      setTecnicos(listaTecnicos);
    };

    carregarTecnicos();
  }, [listarUsers]);

  const mecanicoAtual = useMemo(() => {
    return tecnicos.find((u) => Number(u.id) === Number(mecanicoAtribuidoId)) || null;
  }, [tecnicos, mecanicoAtribuidoId]);

  const getImageUrl = useCallback(
    (caminhoDoBanco) => {
      if (!caminhoDoBanco) return fallbackSrc;

      const caminhoCorrigido = caminhoDoBanco.replace(/\\/g, '/');
      const pathFinal = caminhoCorrigido.startsWith('/')
        ? caminhoCorrigido.slice(1)
        : caminhoCorrigido;

      return `http://localhost:8000/${pathFinal}`;
    },
    [fallbackSrc]
  );

  const getStatusStyles = useCallback((statusName) => {
    switch (normalizeRole(statusName)) {
      case 'concluido':
      case 'concluida':
        return {
          color: '#29C406',
          border: '1px solid #29C406',
          backgroundColor: '#E5FFDF',
          fontWeight: 700,
        };
      case 'em manutencao':
        return {
          color: '#cec108',
          border: '1px solid #cfc209',
          backgroundColor: '#FFFDDF',
          fontWeight: 700,
        };
      default:
        return {
          color: '#6C757D',
          border: '1px solid #6C757D',
          backgroundColor: '#b2bac1',
          fontWeight: 700,
        };
    }
  }, []);

  const handleEditar = useCallback(() => {
    if (!isEditing) {
      setMecanicoSelecionado(mecanicoAtribuidoId || '');
    }
    setIsEditing((prev) => !prev);
  }, [isEditing, mecanicoAtribuidoId]);

  const handleSalvarMecanico = useCallback(async () => {
    if (!mecanicoSelecionado) {
      notify.warning('Selecione um mecânico para salvar.');
      return;
    }

    setSavingMecanico(true);
    const sucesso = await atribuirMoto(moto.id, Number(mecanicoSelecionado));

    if (sucesso) {
      setMecanicoAtribuidoId(Number(mecanicoSelecionado));
      setIsEditing(false);
      notify.success('Mecânico atribuído com sucesso.');
    }

    setSavingMecanico(false);
  }, [atribuirMoto, moto?.id, mecanicoSelecionado]);

  const handleCancelarEdicao = useCallback(() => {
    setMecanicoSelecionado(mecanicoAtribuidoId || '');
    setIsEditing(false);
  }, [mecanicoAtribuidoId]);

  const handleExcluir = useCallback(async () => {
    try {
      await excluirMoto(moto.id);
      notify.success('Moto excluida com sucesso.');
      navigate('/listagemMotos');
    } catch {
      notify.error('Nao foi possivel excluir a moto.');
    }
  }, [excluirMoto, moto?.id, navigate]);

  const handleAbrirChat = useCallback(() => {
    if (motoConcluida) {
      notify.warning('Esta moto já foi concluída e não pode mais acessar o chat.');
      return;
    }

    iniciarNovoChat(moto);
    navigate('/chatbot');
  }, [iniciarNovoChat, moto, motoConcluida, navigate]);

  return {
    canManageMoto,
    isEditing,
    savingMecanico,
    tecnicos,
    mecanicoSelecionado,
    setMecanicoSelecionado,
    mecanicoAtual,
    fallbackSrc,
    motoConcluida,
    getImageUrl,
    getStatusStyles,
    handleEditar,
    handleSalvarMecanico,
    handleCancelarEdicao,
    handleExcluir,
    handleAbrirChat,
  };
};

export default HookInformacoesMoto;
