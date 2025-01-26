import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const formatDateObject = (selectedDate: Date, selectedTime: string) => {
  const formattedDate = format(selectedDate, "dd/MM/yyyy", { locale: ptBR });
  const hour = Number(selectedTime.split(":")[0]);
  const period = hour < 12 ? "manhã" : hour < 18 ? "tarde" : "noite";

  return {
    period,
    hour: selectedTime,
    date: formattedDate,
  };
};

export const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então somamos 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };