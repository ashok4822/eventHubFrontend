export const SERVICE_CATEGORIES = [
  { id: 'venue', label: 'Venue', emoji: '🏰' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'caterer', label: 'Caterer', emoji: '🍽️' },
  { id: 'cameraman', label: 'Cameraman', emoji: '📸' },
  { id: 'DJ', label: 'DJ', emoji: '🎧' },
  { id: 'other', label: 'Other', emoji: '✨' },
] as const;

export const getCategoryEmoji = (categoryId: string): string => {
  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  return category ? category.emoji : '✨';
};
