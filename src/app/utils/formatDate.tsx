import moment from 'moment';

export function formatDateTimeToBR(dateTime: string | Date): string {
  if (!dateTime) return 'Data inválida';
  return moment(dateTime).format('DD/MM/YYYY HH:mm');
}

export function formatDateTimeToBRUTC(dateTime: string | Date): string {
  if (!dateTime) return 'Data inválida';
  return moment(dateTime).utc().format('DD/MM/YYYY HH:mm');
}
