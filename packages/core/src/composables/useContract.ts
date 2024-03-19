import { computed } from 'vue'
import { Abi, Contract, ProviderInterface } from 'starknet'
import { useStarknet } from './useStarknet'

/** Arguments for `useContract`. */
export interface UseContractArgs {
  /** The contract abi. */
  abi?: Abi
  /** The contract address. */
  address?: string
  /** The provider, by default it will be the current one. */
  provider?: ProviderInterface | null
}

/** Value returned from `useContract`. */
export interface UseContractResult {
  /** The contract. */
  contract?: Contract
}

/**
 * Hook to bind a `Contract` instance.
 *
 * @remarks
 *
 * The returned contract is a starknet.js `Contract` object.
 *
 * @example
 * This example creates a new contract from its address and abi.
 * ```tsx
 * function Component() {
 *   const { contract } = useContract({
 *     address: ethAddress,
 *     abi: compiledErc20.abi
 *   })
 *
 *   return <span>{contract.address}</span>
 * }
 * ```
 */
export function useContract({
  abi,
  address,
  provider: providedProvider,
}: UseContractArgs) {
  const { provider: currentProvider } = useStarknet()

  const contract = computed(() => {
    const provider = providedProvider ?? currentProvider
    if (abi && address && provider) {
      return new Contract(abi, address, provider)
    }
    return undefined
  })

  return { contract }
}
