import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Joins class names, letting later Tailwind classes win over earlier ones,
 * so a component's own classes can be overridden from outside.
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
