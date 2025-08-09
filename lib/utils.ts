import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined, locale: string = "ar-SA") {
  try {
    // Handle null/undefined cases
    if (date === null || date === undefined || date === '') {
      return "-";
    }
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    // Always use dd/mm/yyyy format for both Arabic and English
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "-";
  }
}

export function formatDateTime(date: string | Date | null | undefined, locale: string = "ar-SA") {
  try {
    // Handle null/undefined cases
    if (date === null || date === undefined || date === '') {
      return "-";
    }
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    // Always use dd/mm/yyyy HH:MM format for both Arabic and English
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return "-";
  }
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// Convert ISO date string to HTML date input format (YYYY-MM-DD)
export function toDateInputValue(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    
    // Format as YYYY-MM-DD for HTML date input
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    return "";
  }
}

// Convert HTML date input value (YYYY-MM-DD) to ISO string for API
export function fromDateInputValue(dateValue: string): string {
  if (!dateValue) return "";
  
  try {
    // dateValue is in YYYY-MM-DD format, convert to ISO string
    const date = new Date(dateValue + "T00:00:00.000Z");
    return date.toISOString();
  } catch (error) {
    return "";
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
