import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { MotoContext } from '../context/MotoContext.jsx';

// Molde do formulário e regras de validação usando Zod
const motoSchema = z.object({
  modelo: z.string().min(1, 'O modelo é obrigatório.'),
  marca: z.string().min(1, 'A marca é obrigatória.'),
  ano: z.string().min(4, 'O ano deve ter 4 dígitos.'),
  numeroSerie: z.string().min(1, 'O número de série é obrigatório.'),
  descricao: z.string().optional(),
  foto: z.any().optional(),
});

export const HookCadastroMoto = () => {
  const {
    cadastrarMoto,
    erro: erroContexto,
    motos,
    listarMotos,
    verificarNumeroSerie,
    modeloPaiSelecionado,
  } = useContext(MotoContext);

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motoSchema),
    defaultValues: {
      modelo: '',
      marca: '',
      ano: '',
      numeroSerie: '',
      descricao: '',
    },
  });

  useEffect(() => {
    listarMotos();
  }, []);

  useEffect(() => {
    if (modeloPaiSelecionado) {
      setValue('marca', modeloPaiSelecionado.marca || '');
      setValue('modelo', modeloPaiSelecionado.modelo || '');
      setValue('ano', String(modeloPaiSelecionado.ano || ''));
      setValue(
        'foto',
        modeloPaiSelecionado.imagemMoto || modeloPaiSelecionado.imagem_moto || null,
        { shouldValidate: true }
      );
    }
  }, [modeloPaiSelecionado, setValue]);

  const handleProximo = async () => {
    // Validação da etapa 1: campos obrigatórios
    const camposValidos = await trigger(['modelo', 'marca', 'ano', 'numeroSerie']);
    if (!camposValidos) {
      toast.warning('Preencha os campos obrigatórios.'); // <-- Notificação visual
      return;
    }

    if (!modeloPaiSelecionado?.id) {
      toast.warning('Selecione um modelo de moto pai antes de continuar.');
      return;
    }

    const numeroSerieAtual = watch('numeroSerie');

    // Validação de Duplicidade no State
    if (
      motos.some(
        (moto) => moto.numero_serie === numeroSerieAtual || moto.numeroSerie === numeroSerieAtual
      )
    ) {
      setError('numeroSerie', {
        type: 'manual',
        message: 'Este número de série já está registrado.',
      });
      return;
    }

    // Validação de Duplicidade no Backend
    if (verificarNumeroSerie) {
      const exists = await verificarNumeroSerie(numeroSerieAtual);
      if (exists) {
        setError('numeroSerie', {
          type: 'manual',
          message: 'Este número de série já está registrado.',
        });
        return;
      }
    }
  };

  // Submit Form da moto "filha" (sem manual, já foi pro pai)
  const onSubmitForm = async (data) => {
    setLoading(true);

    const marcaFinal = modeloPaiSelecionado?.marca || data.marca;
    const modeloFinal = modeloPaiSelecionado?.modelo || data.modelo;

    const formData = new FormData();
    formData.append('marca', marcaFinal);
    formData.append('modelo', modeloFinal);
    formData.append('ano', data.ano);
    formData.append('numeroSerie', data.numeroSerie);
    formData.append('descricao', data.descricao || '');
    if (data.foto instanceof File) {
      formData.append('imagem_moto', data.foto);
    }

    try {
      const sucesso = await cadastrarMoto(formData);

      if (sucesso) {
        setEtapaAtual(2); // Pula direto pra etapa final
      } else {
        const msgErro = erroContexto || 'Erro ao cadastrar moto.';
        toast.error(msgErro); // Toast de erro específico do contexto ou genérico
      }
    } catch (error) {
      toast.error('Erro inesperado de conexão.'); // Toast de erro genérico para falhas de conexão ou outras exceções
    } finally {
      setLoading(false);
    }
  };

  return {
    etapaAtual,
    loading,
    errors,
    register,
    setValue,
    handleSubmit,
    onSubmitForm,
    watch,
    modeloPaiSelecionado,
  };
};

export default HookCadastroMoto;
