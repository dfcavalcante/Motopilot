import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MotoContext } from '../context/MotoContext';
import { UsersContext } from '../context/UserContext';
import { useLogin } from '../context/LoginContext.jsx';

export const HookListagemMotosModelo = () => {
  const navigate = useNavigate();
  const { modeloMotoId } = useParams();

  const {
    listarMotos,
    motos,
    listarModelosMoto,
    modelosMoto,
    motoSelecionada,
    setMotoSelecionada,
    setModeloPaiSelecionado,
    atribuirMoto,
  } = useContext(MotoContext);

  const { listarUsers } = useContext(UsersContext);
  const { user } = useLogin();

  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mecanicoSelecionado, setMecanicoSelecionado] = useState({});

  const role = String(user?.funcao || '').toLowerCase();
  const isGerente = role === 'gerente' || role === 'administrador' || role === 'admin';
  const isTecnico = role === 'tecnico' || role === 'técnico';

  useEffect(() => {
    listarMotos();
    listarModelosMoto();
  }, []);

  useEffect(() => {
    const carregarTecnicos = async () => {
      const usuarios = await listarUsers();
      setUsuarios(usuarios || []);

      if (!isGerente) return;

      const listaTecnicos = (usuarios || []).filter((u) => {
        const funcao = String(u.funcao || '').toLowerCase();
        return funcao === 'tecnico' || funcao === 'técnico';
      });
      setTecnicos(listaTecnicos);
    };

    carregarTecnicos();
  }, [isGerente, listarUsers]);

  const openMenu = Boolean(anchorEl);

  const handleClickOrdernar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const modeloPai = useMemo(() => {
    const idNumerico = Number(modeloMotoId);
    return modelosMoto.find((modelo) => Number(modelo.id) === idNumerico) || null;
  }, [modelosMoto, modeloMotoId]);

  useEffect(() => {
    if (modeloPai) {
      setModeloPaiSelecionado(modeloPai);
    }
  }, [modeloPai, setModeloPaiSelecionado]);

  const motosProcessadas = useMemo(() => {
    const idNumerico = Number(modeloMotoId);

    let lista = motos.filter(
      (moto) => Number(moto.modeloMotoId ?? moto.modelo_moto_id) === idNumerico
    );

    if (input) {
      lista = lista.filter(
        (moto) =>
          moto.modelo?.toLowerCase().includes(input.toLowerCase()) ||
          moto.marca?.toLowerCase().includes(input.toLowerCase()) ||
          String(moto.numeroSerie || moto.numero_serie || '')
            .toLowerCase()
            .includes(input.toLowerCase())
      );
    }

    if (tipoOrdenacao === 'AZ') {
      lista.sort((a, b) => (a.modelo || '').localeCompare(b.modelo || ''));
    } else if (tipoOrdenacao === 'ZA') {
      lista.sort((a, b) => (b.modelo || '').localeCompare(a.modelo || ''));
    }

    if (isTecnico && user?.id) {
      lista = lista.filter(
        (moto) => Number(moto.mecanicoId ?? moto.mecanico_id) === Number(user.id)
      );
    }

    return lista;
  }, [motos, input, tipoOrdenacao, modeloMotoId, isTecnico, user?.id]);

  const handleAtribuirMoto = async (motoId) => {
    const mecanicoId = mecanicoSelecionado[motoId];
    if (!mecanicoId) {
      alert('Selecione um técnico para atribuir a moto.');
      return;
    }

    const sucesso = await atribuirMoto(motoId, Number(mecanicoId));
    if (sucesso) {
      await listarMotos(true);
      alert('Moto atribuída com sucesso.');
    }
  };

  const getNomeMecanico = (moto) => {
    const mecanicoId = moto?.mecanicoId ?? moto?.mecanico_id;
    if (!mecanicoId) return 'Não atribuído';

    const mecanico = usuarios.find((u) => Number(u.id) === Number(mecanicoId));
    return mecanico?.nome || `ID ${mecanicoId}`;
  };

  return {
    navigate,
    modeloPai,
    motoSelecionada,
    setMotoSelecionada,
    isGerente,
    isTecnico,
    input,
    setInput,
    anchorEl,
    openMenu,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
    motosProcessadas,
    tecnicos,
    usuarios,
    mecanicoSelecionado,
    setMecanicoSelecionado,
    handleAtribuirMoto,
    getNomeMecanico,
  };
};
