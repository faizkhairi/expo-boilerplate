import { config as defaultConfig } from '@gluestack-ui/config'

export const config = defaultConfig

export type Config = typeof config

declare module '@gluestack-ui/themed' {
  interface ICustomConfig extends Config {}
}
