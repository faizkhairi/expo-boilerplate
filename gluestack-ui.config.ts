import { config as defaultConfig } from '@gluestack-ui/config'

export const config = defaultConfig

export type Config = typeof config

declare module '@gluestack-ui/themed' {
  // Empty on purpose: declaration merging gives gluestack this app's theme type.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ICustomConfig extends Config {}
}
