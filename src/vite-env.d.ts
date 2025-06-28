/// <reference types="vite/client" />

declare module '*.svg?asset' {
  const src: string;
  export default src;
}