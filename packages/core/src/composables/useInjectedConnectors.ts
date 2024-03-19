import { ref, onMounted, computed } from 'vue'
import { shuffle } from 'radash'
import { Connector } from '../connectors/base'
import { injected, getAvailableWallets } from '../connectors/helpers'

export type UseInjectedConnectorsOptions = {
  /** List of recommended connectors to display. */
  recommended?: Connector[]
  /** Whether to include recommended connectors in the list. */
  includeRecommended?: 'always' | 'onlyIfNoConnectors'
  /** How to order connectors. */
  order?: 'random' | 'alphabetical'
}

export type UseInjectedConnectorsResult = {
  /** Connectors list. */
  connectors: Connector[]
}

type MergeConnectorsOptions = Required<
  Pick<UseInjectedConnectorsOptions, 'includeRecommended' | 'order'>
>

export function useInjectedConnectors({
  recommended,
  includeRecommended = 'always',
  order = 'alphabetical',
}: UseInjectedConnectorsOptions) {
  const injectedConnectors = ref<Connector[]>([])

  onMounted(() => {
    const wallets = getAvailableWallets(window)
    const connectors = wallets.map(({ id }) => injected({ id }))
    injectedConnectors.value = mergeConnectors(connectors, recommended ?? [], {
      includeRecommended,
      order,
    })
  })

  const connectors = computed(() => injectedConnectors.value)

  return { connectors }
}

function mergeConnectors(
  injected: Connector[],
  recommended: Connector[],
  { includeRecommended, order }: MergeConnectorsOptions,
): Connector[] {
  const injectedIds = new Set(injected.map((connector) => connector.id))
  const allConnectors = [...injected]
  const shouldAddRecommended =
    includeRecommended === 'always' ||
    (includeRecommended === 'onlyIfNoConnectors' && injected.length === 0)
  if (shouldAddRecommended) {
    allConnectors.push(
      ...recommended.filter((connector) => !injectedIds.has(connector.id)),
    )
  }

  if (order === 'random') {
    return shuffle(allConnectors)
  }
  return allConnectors.sort((a, b) => a.id.localeCompare(b.id))
}
