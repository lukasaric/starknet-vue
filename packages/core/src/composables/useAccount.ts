import { ref, onMounted, computed } from 'vue'
import { AccountInterface } from 'starknet'
import { useStarknetAccount } from './useAccountContext'
import { useConnect } from './useConnect'
import { Connector } from '~/connectors'

/** Account connection status. */
export type AccountStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'reconnecting'

/** Value returned from `useAccount`. */
export type AccountState = {
  /** The connected account object. */
  account?: AccountInterface
  /** The address of the connected account. */
  address?: string
  /** The connected connector. */
  connector?: Connector
  /** Connector's chain id */
  chainId?: bigint
  /** True if connecting. */
  isConnecting?: boolean
  /** True if reconnecting. */
  isReconnecting?: boolean
  /** True if connected. */
  isConnected?: boolean
  /** True if disconnected. */
  isDisconnected?: boolean
  /** The connection status. */
  status: AccountStatus
}

/** Arguments for `useAccount` hook. */
export type AccountOptions = {
  /** Function to invoke when connected. */
  onConnect?: (args: {
    address?: AccountState['address']
    connector?: AccountState['connector']
  }) => void
  /** Function to invoke when disconnected. */
  onDisconnect?: () => void
}

/**
 * Composable for accessing the account and its connection status.
 *
 * @remarks
 *
 * This composable is used to access the `AccountInterface` object provided by the
 * currently connected wallet.
 *
 * @example
 * This example shows how to display the wallet connection status and
 * the currently connected wallet address.
 *
 * ```vue
 * <template>
 *   <p v-if="status === 'disconnected'">Disconnected</p>
 *   <p v-else>Account: {{ address }}</p>
 * </template>
 *
 * <script setup lang="ts">
 *   const { account, address, status } = useAccount()
 * </script>
 */
export function useAccount({ onConnect, onDisconnect }: AccountOptions = {}) {
  const { account: connectedAccount } = useStarknetAccount()
  const { connectors } = useConnect()

  const state = ref<AccountState>({ status: 'disconnected' })

  const handleDisconnectedState = () => {
    if (!state.value.isDisconnected && onDisconnect !== undefined) {
      onDisconnect()
    }

    return Object.assign(state.value, {
      status: 'disconnected',
      isDisconnected: true,
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
    })
  }

  const handleConnectors = async () => {
    for (const connector of connectors) {
      if (!connector.available()) continue

      // If the connector is not authorized, `.account()` will throw.
      let connAccount
      try {
        connAccount = connector.account()
      } catch {}

      if (connAccount && connAccount?.address === connectedAccount?.address) {
        if (state.value.isDisconnected && onConnect !== undefined) {
          onConnect({ address: connectedAccount.address, connector })
        }

        return Object.assign(state.value, {
          connector,
          chainId: await connector.chainId(),
          account: connectedAccount,
          address: connectedAccount.address,
          status: 'connected',
          isConnected: true,
          isConnecting: false,
          isDisconnected: false,
          isReconnecting: false,
        })
      }
    }
  }

  const refreshState = async () => {
    if (!connectedAccount) {
      handleDisconnectedState()
    }

    await handleConnectors()
  }

  onMounted(async () => await refreshState())

  return { state: computed(() => state.value) }
}
