import { createContext, useContext, useEffect, useState } from "react";
import { getEmpresa } from "../services/empresaService";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {

  const [empresa, setEmpresa] = useState(null);
  const [empresaLoading, setEmpresaLoading] = useState(true);

  const cargarEmpresa = async () => {
    try {

      const empresaData = await getEmpresa();

      setEmpresa(empresaData);

    } catch (error) {
      setEmpresa(null);
    }
    finally {
      setEmpresaLoading(false);
    }
  };
  useEffect(() => {
    cargarEmpresa();
  }, []);

  return (
    <EmpresaContext.Provider
      value={{
        empresa,
        empresaLoading,
        cargarEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresaContext);