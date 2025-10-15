import { Coffee, BookOpen, User } from 'lucide-react';

export const iconMap = {
  User,
  BookOpen,
  Coffee
};

export const categoryIconMap = {
  Programming: Coffee,
  Science: BookOpen,
  Mathematics: User,
};

export const awardPoints = (pts = 10) => {
  console.log(`Awarded ${pts} points!`);
};
