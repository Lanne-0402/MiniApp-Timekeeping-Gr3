export const calculateWorkTime = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const ms = end - start;

  const hours = Math.floor(ms / 1000 / 60 / 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);

  return `${hours}h ${minutes}m`;
};
