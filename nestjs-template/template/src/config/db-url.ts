// import { getEnvs } from '@/utils'
//
// const envs = getEnvs()
// console.log('>-----------(db-url.ts:4) var is envs:', envs)
export const DB_URL: {
  [key: string]: Record<string, string>
} = {
  // mysql2: `${ envs.DATABASE_TYPE }://${ envs.DATABASE_USER }:${ envs.DATABASE_PASSWORD }@${ envs.DATABASE_HOST }:${ envs.DATABASE_PORT }/${ envs.DATABASE_NAME }`,
  development: {
    postgresql: 'postgresql://postgres:123456@localhost:5432/moyi-be-p?schema=public',
    mongodb: 'mongodb://root:123456@localhost:27017/moyi-be-p',
    mysql1: 'mysql://root:example@localhost:3308/moyi-be-p',
    mysql2: 'mysql://root:example@localhost:3309/moyi-be-p',
    postgres1: 'postgresql://pguser:example@localhost:5431/moyi-be-p',
    postgres2: 'postgresql://pguser:example@localhost:5430/moyi-be-p',
    default: 'mysql://root:example@localhost:3309/moyi-be-p'
  },
  production: {
    postgresql: 'postgresql://postgres:123456@localhost:5432/moyi-be-p?schema=public',
    mongodb: 'mongodb://root:123456@localhost:27017/moyi-be-p',
    mysql1: 'mysql://root:example@localhost:3308/moyi-be-p',
    mysql2: 'mysql://root:example@localhost:3309/moyi-be-p',
    postgres1: 'postgresql://pguser:example@localhost:5431/moyi-be-p',
    postgres2: 'postgresql://pguser:example@localhost:5430/moyi-be-p',
    default: 'mysql://root:example@localhost:3309/moyi-be-p'
  }
}
