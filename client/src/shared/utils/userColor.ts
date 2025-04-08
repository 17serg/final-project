/**
 * Утилита для получения цвета пользователя на основе его email
 * @param email - Email пользователя
 * @returns Цвет в формате HEX
 */
export const getUserColor = (value: string | undefined): string => {
  if (!value) {
    return '#BAE1FF'; // Возвращаем цвет по умолчанию, если значение не определено
  }

  const hash = value.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const h = hash % 360;
  return `hsl(${h}, 70%, 80%)`;
}; 