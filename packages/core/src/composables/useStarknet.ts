import { type InjectionKey, provide, inject } from 'vue'
import { ProviderInterface } from 'starknet'
import { Chain } from '@starknet-vue/chains'
import { Connector } from '~/connectors'
import { ExplorerFactory } from '~/explorers/'

export interface StarknetContext {
  /** Connected connector. */
  connector?: Connector
  /** Connect the given connector. */
  connect: ({ connector }: { connector?: Connector }) => Promise<void>
  /** Disconnect the currently connected connector. */
  disconnect: () => Promise<void>
  /** List of registered connectors. */
  connectors: Connector[]
  /** Current explorer factory. */
  explorer?: ExplorerFactory
  /** Chains supported by the app. */
  chains: Chain[]
  /** Current chain. */
  chain: Chain
  /** Current provider. */
  provider: ProviderInterface
  /** Error. */
  error?: Error
}

const StarknetContextKey: InjectionKey<StarknetContext> =
  Symbol('StarknetContext')

export function createStarknetContext(props: StarknetContext): void {
  return provide(StarknetContextKey, props)
}

export function useStarknet(): StarknetContext {
  const ctx = inject(StarknetContextKey)
  if (!ctx) {
    throw new Error(
      'useStarknet must be used within a StarknetProvider or StarknetConfig',
    )
  }
  return ctx
}
