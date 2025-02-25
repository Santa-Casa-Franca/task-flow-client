import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Item {
  NR_SEQUENCIA: string;
  NOME: string;
}

export function exportExceptionsToXLSX(items: Item[], filename: string = 'exceptions.xlsx') {
  if (items.length === 0) {
    console.warn('Nenhum dado para exportar.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(items, { header: ['NR_SEQUENCIA', 'NOME'] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Exceptions');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
}
