import { useContext } from "react";
import { createContext } from "react";


const RelatorioContext = createContext();

export const useRelatorio = () => {
    //criar relatório
    const criarRelatório = async (dados) => { 
    setLoading(true);
    setErro(null);

    try {
      const isFormData = dados instanceof FormData;
      
      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const body = isFormData ? dados : JSON.stringify(dados);

      const response = await fetch(`${BASE_URL}/relatorio/`, {
        method: "POST",
        headers: headers, 
        body: body,       
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || "Erro ao cadastrar moto";
        throw new Error(msg);
      }

      const novaMoto = await response.json();
      setMotos((prev) => [...prev, novaMoto]);
      return true;

    } catch (error) {
      console.error(error);
      setErro(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
};

export const RelatorioProvider = ({ children }) => {
    const [relatorios, setRelatorios] = useState([]);

    const addRelatorio = (relatorio) => {
        setRelatorios(prev => [...prev, relatorio]);
    };

    return (
        <RelatorioContext.Provider value={{ relatorios, criarRelatorio }}>
            {children}
        </RelatorioContext.Provider>
    );
};