import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}


export function formatPrice(
  cents: number,
  options?: { freeLabel?: string }
): string {
  if (cents === 0) {
    return options?.freeLabel ?? 'Free'
  }
  return `$${(cents / 100).toFixed(2)}`
}


export function formatEventDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(
    undefined,
    options ?? defaultOptions
  )
}

export function formatEventDateLong(dateStr: string): string {
  return formatEventDate(dateStr, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat(undefined, options ?? defaultOptions).format(
    new Date(date)
  )
}

export function formatDateTimeWithTime(date: Date | string): string {
  return formatDateTime(date, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function getUserInitials(email: string): string {
  return email.charAt(0).toUpperCase()
}
