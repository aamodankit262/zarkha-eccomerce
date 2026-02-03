import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const capitalizeWords = (text: string) => {
  return  text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}
export const formatDate = (date?: string | null, fallback = "Pending") => {
    return date ? dayjs(date).format("ddd, DD MMM YYYY, hh:mm A") : fallback;
  };