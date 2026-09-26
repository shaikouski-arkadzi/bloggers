export const timestampToIso = (timestamp: string | number): string => {
  return new Date(Number(timestamp) * 1000).toISOString();
};

export const isoToTimestamp = (date: string): string => {
  return Math.floor(new Date(date).getTime() / 1000).toString();
};
