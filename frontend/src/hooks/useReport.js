import { useContext } from 'react';
import { ReportContext } from './ReportContext';

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport deve ser usado dentro de ReportProvider');
  }
  return context;
};
