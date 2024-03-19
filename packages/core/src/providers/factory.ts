import { Chain } from '@starknet-vue/chains'
import { ProviderInterface } from 'starknet'

export type ChainProviderFactory<
  T extends ProviderInterface = ProviderInterface,
> = (chain: Chain) => T | null
