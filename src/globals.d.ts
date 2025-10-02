declare global {
  interface Window {
    navigateTo?: (page: string) => void;
  }
}

export {};