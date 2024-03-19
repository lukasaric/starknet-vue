import type { StarknetWindowObject } from 'get-starknet-core'
import { InjectedConnector } from './injected'

export function argent(): InjectedConnector {
  return new InjectedConnector({
    options: {
      id: 'argentX',
      name: 'Argent',
    },
  })
}

export function braavos(): InjectedConnector {
  return new InjectedConnector({
    options: {
      id: 'braavos',
      name: 'Braavos',
    },
  })
}

export function injected({ id }: { id: string }): InjectedConnector {
  return new InjectedConnector({
    options: {
      id,
    },
  })
}

export function getAvailableWallets(
  obj: Record<string, any>,
): StarknetWindowObject[] {
  return Object.values(
    Object.getOwnPropertyNames(obj).reduce<
      Record<string, StarknetWindowObject>
    >((wallets, key) => {
      if (key.startsWith('starknet')) {
        const wallet = obj[key]

        if (isWalletObject(wallet) && !wallets[wallet.id]) {
          wallets[wallet.id] = wallet
        }
      }
      return wallets
    }, {}),
  )
}

export function isWalletObject(wallet: any): wallet is StarknetWindowObject {
  try {
    return (
      wallet &&
      [
        // wallet's must have methods/members, see IStarknetWindowObject
        'request',
        'isConnected',
        'provider',
        'enable',
        'isPreauthorized',
        'on',
        'off',
        'version',
        'id',
        'name',
        'icon',
      ].every((key) => key in wallet)
    )
  } catch (err) {}
  return false
}
