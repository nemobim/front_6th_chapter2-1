export const isTuesday = (): boolean => {
  return new Date().getDay() === 2; // 0=일요일, 1=월요일, 2=화요일
};
