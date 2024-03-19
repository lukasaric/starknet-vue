import { Chain } from '@starknet-vue/chains'
import { RpcProvider, RpcProviderOptions } from 'starknet'
import { starknetChainId } from '../helpers/context'
import { ChainProviderFactory } from './factory'

/** Arguments for `jsonRpcProvider`. */
export type JsonRpcProviderArgs = {
  rpc: (chain: Chain) => RpcProviderOptions | null
}

/** Configure the JSON-RPC provider using the provided function. */
export function jsonRpcProvider({
  rpc,
}: JsonRpcProviderArgs): ChainProviderFactory<RpcProvider> {
  return function (chain) {
    const config = rpc(chain)
    if (!config) return null
    const chainId = starknetChainId(chain.id)

    return new RpcProvider({ ...config, chainId })
  }
}
