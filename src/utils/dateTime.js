export function formatDate(date){

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "UTC",
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date)
}