import { ref, watchEffect } from 'vue'
import { QueryKey, useQueryClient } from '@tanstack/vue-query'
import { useBlockNumber } from './useBlockNumber'

/**
 * Invalidate the given query on every new block.
 */
export function useInvalidateOnBlock({
  enabled = true,
  queryKey,
}: {
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()

  const prevBlockNumber = ref<number | undefined>()

  const { data: blockNumber } = useBlockNumber({ enabled })

  watchEffect(() => {
    if (!prevBlockNumber.value) {
      prevBlockNumber.value = blockNumber.value
      return
    }

    if (blockNumber.value !== prevBlockNumber.value) {
      queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
      prevBlockNumber.value = blockNumber.value
    }
  })
}
