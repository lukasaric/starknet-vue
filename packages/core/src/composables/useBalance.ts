import { Chain } from '@starknet-vue/chains'
import { computed, toRef } from 'vue'
import {
  CallData,
  ContractInterface,
  num,
  shortString,
  uint256,
} from 'starknet'
import { z } from 'zod'
import { useContract } from './useContract'
import { useInvalidateOnBlock } from './useInvalidateOnBlock'
import { useNetwork } from './useNetwork'
import { UseQueryProps, UseQueryResult, useQuery } from '~/query'

export type Balance = {
  decimals: number
  symbol: string
  formatted: string
  value: bigint
}

export type UseBalanceProps = UseQueryProps<
  Balance,
  Error,
  Balance,
  ReturnType<typeof queryKey>
> & {
  /** The contract's address. Defaults to the native currency. */
  token?: string
  /** The address to fetch balance for. */
  address?: string
  /** Whether to watch for changes. */
  watch?: boolean
}

export type UseBalanceResult = UseQueryResult<Balance, Error>

export function useBalance({
  token,
  address,
  watch = false,
  enabled: enabled_ = true,
  ...props
}: UseBalanceProps) {
  const { chain } = useNetwork()
  const { contract } = useContract({
    abi: balanceABIFragment,
    address: token ?? chain.nativeCurrency.address,
  })

  const _queryKey = computed(() => {
    return queryKey({ chain, contract, token, address })
  })

  const enabled = computed(() => !!(enabled_ && contract && address))

  useInvalidateOnBlock({
    enabled: Boolean(enabled && watch),
    queryKey: _queryKey,
  })

  return useQuery({
    queryKey: _queryKey.value,
    queryFn: queryFn({ chain, contract, token, address }),
    ...toRef(props),
  })
}

function queryKey({
  chain,
  contract,
  token,
  address,
}: {
  chain: Chain
  contract?: ContractInterface
  token?: string
  address?: string
}) {
  return [
    {
      entity: 'balance',
      chainId: chain?.name,
      contract,
      token,
      address,
    },
  ] as const
}

function queryFn({
  chain,
  token,
  address,
  contract,
}: {
  chain: Chain
  token?: string
  address?: string
  contract?: ContractInterface
}) {
  return async function () {
    if (!address) {
      throw new Error('address is required')
    }
    if (!contract) {
      throw new Error('contract is required')
    }

    let symbolPromise = Promise.resolve(chain.nativeCurrency.symbol)
    if (token) {
      symbolPromise = contract.call('symbol', []).then((result) => {
        const s = symbolSchema.parse(result).symbol
        return shortString.decodeShortString(num.toHex(s))
      })
    }

    let decimalsPromise = Promise.resolve(chain.nativeCurrency.decimals)
    if (token) {
      decimalsPromise = contract.call('decimals', []).then((result) => {
        return Number(decimalsSchema.parse(result).decimals)
      })
    }

    const balanceOfPromise = contract
      .call('balanceOf', CallData.compile({ address }))
      .then((result) => {
        return uint256.uint256ToBN(balanceSchema.parse(result).balance)
      })

    const [balanceOf, decimals, symbol] = await Promise.all([
      balanceOfPromise,
      decimalsPromise,
      symbolPromise,
    ])

    const formatted = formatUnits(balanceOf, decimals)

    return {
      value: balanceOf,
      decimals,
      symbol,
      formatted,
    }
  }
}

const uint256Schema = z.object({
  low: z.bigint(),
  high: z.bigint(),
})

const balanceSchema = z.object({
  balance: uint256Schema,
})

const decimalsSchema = z.object({
  decimals: z.bigint(),
})

const symbolSchema = z.object({
  symbol: z.bigint(),
})

const balanceABIFragment = [
  {
    members: [
      {
        name: 'low',
        offset: 0,
        type: 'felt',
      },
      {
        name: 'high',
        offset: 1,
        type: 'felt',
      },
    ],
    name: 'Uint256',
    size: 2,
    type: 'struct',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [
      {
        name: 'account',
        type: 'felt',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'Uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: 'symbol',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: 'decimals',
        type: 'felt',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

/*
MIT License

Copyright (c) 2023-present weth, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/wevm/viem/blob/main/src/utils/unit/formatUnits.ts
*/

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value: bigint, decimals: number) {
  let display = value.toString()

  const negative = display.startsWith('-')
  if (negative) {
    display = display.slice(1)
  }

  display = display.padStart(decimals, '0')

  const [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ]
  const normalizedFraction = fraction.replace(/(0+)$/, '')
  return `${negative ? '-' : ''}${integer || '0'}${
    normalizedFraction ? `.${normalizedFraction}` : ''
  }`
}
