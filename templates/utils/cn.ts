import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge classNames conditionally.
 * Wrapper around clsx for consistent usage across projects.
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', { 'active': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

