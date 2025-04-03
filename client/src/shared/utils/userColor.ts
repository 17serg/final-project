/**
 * Утилита для получения цвета пользователя на основе его email
 * @param email - Email пользователя
 * @returns Цвет в формате HEX
 */
export const getUserColor = (email: string): string => {
  const colors = [
    "#FFB3BA", // нежно-розовый
    "#BAFFC9", // нежно-мятный
    "#BAE1FF", // нежно-голубой
    "#FFFFBA", // нежно-желтый
    "#FFE4BA", // нежно-персиковый
    "#E8BAFF", // нежно-лавандовый
    "#BAE8FF", // нежно-бирюзовый
    "#FFD1BA", // нежно-коралловый
    "#BAFFD1", // нежно-зеленый
    "#D1BAFF", // нежно-фиолетовый
  ];
  
  // Создаем числовое значение на основе email
  const hash = email.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Используем это значение для выбора цвета
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}; 