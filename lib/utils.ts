'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleQuickAction(action: string) {
  if (action === "create_mock") {
    window.location.href = "/create-mock";
    return;
  }
  console.log("Action:", action);
}