/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // 在这里可以继续添加其他以 VITE_ 开头的环境变量
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }