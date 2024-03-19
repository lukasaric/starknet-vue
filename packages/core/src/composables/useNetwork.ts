import { Chain } from '@starknet-vue/chains'
import { useStarknet } from './useStarknet'

/** Value returned from `useNetwork`. */
export type UseNetworkResult = {
  /** The current chain. */
  chain: Chain
  /** List of supported chains. */
  chains: Chain[]
}

/**
 * Composable for accessing the current connected chain.
 *
 * @remarks
 *
 * The network object contains information about the
 * network.
 *
 * @example
 * This example shows how to display the current network name.
 *
 * ```vue
 * <template>
 *   <span>{chain.name}</span>
 * </template>
 *
 * <script setup lang="ts">
 *   const { chain } = useNetwork()
 * </script>
 */
export function useNetwork(): UseNetworkResult {
  const { chain, chains } = useStarknet()
  return { chain, chains }
}
