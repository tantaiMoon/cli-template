declare module 'express' {
  interface Request {
    user: {
      username: string
      password?: string
      id: number
      roles?: any[]
    }
    i18nLang?: string
  }
}

export {}
