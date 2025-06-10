export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekOf = (date: Date): string => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  return formatDate(startOfWeek);
};

export const getDaysOfWeek = (weekOf: string): string[] => {
  const startDate = new Date(weekOf);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(formatDate(day));
  }
  return days;
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatWeekRange = (weekOf: string): string => {
  const startDate = new Date(weekOf);
  const endDate = new Date(weekOf);
  endDate.setDate(startDate.getDate() + 6);
  
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};
