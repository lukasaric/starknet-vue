import { type InjectionKey, provide, inject } from 'vue'
import { AccountInterface } from 'starknet'

export type StarknetAccountContext = AccountInterface

const AccountContextKey: InjectionKey<StarknetAccountContext | undefined> =
  Symbol('StarknetAccountContext')

export function createStarknetAccountContext(
  props: StarknetAccountContext | undefined,
): void {
  return provide(AccountContextKey, props)
}

export function useStarknetAccount() {
  const account = inject(AccountContextKey)
  return { account }
}
