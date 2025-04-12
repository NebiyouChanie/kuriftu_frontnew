import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const  BASE_URL = "https://kuriftu-backend-l9gk.onrender.com"




