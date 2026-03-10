import { useState, useContext, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UsersContext } from '../context/UserContext';

//Esquema do Zod
const usuarioSchema = z
  .object({
    nomeCompleto: z.string().min(1, 'Campo Obrigatório *'),
    email: z.string().min(1, 'Campo Obrigatório *').email('Formato de email inválido'),
    numeroMatricula: z.string().min(1, 'Campo Obrigatório *'),
    funcao: z.enum(['Administrador', 'Tecnico'], {
      required_error: 'Selecione uma função',
    }),

    senha: z
      .string()
      .min(8, 'Mínimo de 8 caracteres')
      .max(12, 'Máximo de 12 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número')
      .optional()
      .or(z.literal('')),
    confirmarSenha: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // Só exige que as senhas batam se a pessoa já estiver preenchendo a senha
      if (data.senha || data.confirmarSenha) {
        return data.senha === data.confirmarSenha;
      }
      return true;
    },
    {
      message: 'As senhas não conferem',
      path: ['confirmarSenha'],
    }
  );

export const HookUsers = () => {
  const {
    verificarMatricula,
    verificarEmail,
    cadastrarUser,
    listarUsers,
    excluirUser,
    atualizarUser,
  } = useContext(UsersContext);

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usersProcessados, setUsersProcessados] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [atualizando, setAtualizando] = useState(null);

  //React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      numeroMatricula: '',
      funcao: '',
      senha: '',
      confirmarSenha: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Chama a função do seu Context que vai lá no backend buscar a galera
        const usuariosDoBanco = await listarUsers();

        // Se vier dados, a gente salva na variável que vai pra tela
        if (usuariosDoBanco) {
          setUsersProcessados(usuariosDoBanco);
        }
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    };

    buscarDados();
  }, [listarUsers]);

  // --- Validação e Navegação entre Etapas ---
  const handleProximo = async () => {
    // Valida apenas os campos da primeira etapa
    const camposValidos = await trigger(['nomeCompleto', 'email', 'numeroMatricula', 'funcao']);

    if (camposValidos) {
      setLoading(true);
      const emailDigitado = watch('email');
      const matriculaDigitada = watch('numeroMatricula');

      let temErroAsync = false;

      // Verifica Matrícula no banco
      if (verificarMatricula) {
        const matriculaExiste = await verificarMatricula(matriculaDigitada);
        if (matriculaExiste) {
          setError('numeroMatricula', {
            type: 'manual',
            message: `A matrícula '${matriculaDigitada}' já está registrada.`,
          });
          temErroAsync = true;
        }
      }

      // Verifica Email no banco
      if (verificarEmail) {
        const emailExiste = await verificarEmail(emailDigitado);
        if (emailExiste) {
          setError('email', {
            type: 'manual',
            message: `O email '${emailDigitado}' já está registrado.`,
          });
          temErroAsync = true;
        }
      }

      setLoading(false);

      if (!temErroAsync) {
        setEtapaAtual(2);
      }
    }
  };

  const handleVoltar = () => {
    setEtapaAtual(1);
  };

  // --- Submissão final do formulário (Etapa 2) ---
  const onSubmitForm = async (dadosDaTela) => {
    setLoading(true);
    try {
      const sucesso = await cadastrarUser(dadosDaTela);
      if (sucesso) {
        setEtapaAtual(3);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Menu e Ordenação ---
  const openMenu = Boolean(anchorEl);

  const handleClickOrdernar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectOrder = (order) => {
    // Ordena os usuários processados
    const sorted = [...usersProcessados].sort((a, b) => {
      switch (order) {
        case 'nome':
          return a.nomeCompleto.localeCompare(b.nomeCompleto);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'funcao':
          return a.funcao.localeCompare(b.funcao);
        default:
          return 0;
      }
    });
    setUsersProcessados(sorted);
    handleCloseMenu();
  };

  // --- Edição e Exclusão ---
  const handleEditUser = async (usuarioAtualizado) => {
    try {
      await atualizarUser(usuarioAtualizado.id, usuarioAtualizado);
      setAtualizando(null);
      // Recarrega a lista
      const usuariosDoBanco = await listarUsers();
      setUsersProcessados(usuariosDoBanco);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await excluirUser(id);
      // Recarrega a lista
      const usuariosDoBanco = await listarUsers();
      setUsersProcessados(usuariosDoBanco);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return {
    // Cadastro
    etapaAtual,
    loading,
    errors,
    register,
    watch,
    handleSubmit,
    handleProximo,
    handleVoltar,
    onSubmitForm,
    control,
    // Listagem
    usersProcessados,
    viewMode,
    setViewMode,
    input,
    setInput,
    anchorEl,
    openMenu,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
    // Edição e Exclusão
    atualizando,
    setAtualizando,
    handleEditUser,
    excluirUser: handleDeleteUser,
  };
};
