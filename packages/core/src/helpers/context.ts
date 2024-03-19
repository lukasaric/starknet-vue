import { constants } from 'starknet'
import { goerli, mainnet, sepolia } from '@starknet-vue/chains'

export function starknetChainId(
  chainId: bigint,
): constants.StarknetChainId | undefined {
  switch (chainId) {
    case mainnet.id:
      return constants.StarknetChainId.SN_MAIN
    case goerli.id:
      return constants.StarknetChainId.SN_GOERLI
    case sepolia.id:
      return constants.StarknetChainId.SN_SEPOLIA
    default:
      return undefined
  }
}
