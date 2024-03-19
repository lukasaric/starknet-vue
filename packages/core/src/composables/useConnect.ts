import { useStarknet } from './useStarknet'
import { Connector } from '~/connectors/base'
import { UseMutationProps, UseMutationResult, useMutation } from '~/query'

export type ConnectVariables = { connector?: Connector }

type MutationResult = UseMutationResult<void, unknown, ConnectVariables>

export type UseConnectProps = UseMutationProps<void, unknown, ConnectVariables>

/** Value returned from `useConnect`. */
export type UseConnectResult = Omit<
  MutationResult,
  'mutate' | 'mutateAsync'
> & {
  /** Current connector. */
  connector?: Connector
  /** Connectors available for the current chain. */
  connectors: Connector[]
  /** Connector waiting approval for connection. */
  pendingConnector?: Connector
  /** Connect to a new connector. */
  connect: (args?: ConnectVariables) => void
  /** Connect to a new connector. */
  connectAsync: (args?: ConnectVariables) => Promise<void>
}

/**
 * Composable for connecting to a StarkNet wallet.
 *
 * @remarks
 *
 * Use this to implement a "connect wallet" component.
 *
 * @example
 * This example shows how to connect a wallet.
 * ```vue
 * <template>
 *    <ul>
 *       <li v-for="connector in connetors" :key="connector.id">
 *         <button @click="connect({ connector })">
 *           {{ connector.name }}
 *         </button>
 *       </li>
 *     </ul>

 * </template>
 *
 * <script setup lang="ts">
 *   const { connect, connectors } = useConnect();
 * </script>
 */
export function useConnect(props: UseConnectProps = {}): UseConnectResult {
  const { connector, connectors, connect: connect_, chain } = useStarknet()

  const { mutate, mutateAsync, variables, ...result } = useMutation({
    mutationKey: [{ entity: 'connect', chainId: chain.name }],
    mutationFn: connect_,
    ...props,
  })

  const connect = (args?: ConnectVariables) => mutate(args ?? { connector })

  const connectAsync = (args?: ConnectVariables) =>
    mutateAsync(args ?? { connector })

  return {
    connector,
    connectors,
    pendingConnector: variables.value?.connector,
    connect,
    connectAsync,
    variables,
    ...result,
  }
}
