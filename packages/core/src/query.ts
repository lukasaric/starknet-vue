import {
  QueryKey,
  UseMutationOptions as UseMutationOptions_,
  UseQueryOptions as UseQueryOptions_,
  UseQueryReturnType,
  useMutation as _useMutation,
  useQuery as _useQuery,
  DefaultError,
  UseMutationReturnType,
  QueryObserverOptions,
  MutationObserverOptions,
} from '@tanstack/vue-query'

export type UseQueryProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Pick<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
  'enabled' | 'refetchInterval' | 'retry' | 'retryDelay'
>

export type UseQueryResult<TData, TError> = Pick<
  UseQueryReturnType<TData, TError>,
  | 'data'
  | 'error'
  | 'status'
  | 'isSuccess'
  | 'isError'
  | 'isPending'
  | 'fetchStatus'
  | 'isFetching'
  | 'isLoading'
  | 'refetch'
>

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: UseQueryOptions_<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const base = _useQuery(args)

  return {
    data: base.data,
    error: base.error,
    status: base.status,
    isSuccess: base.isSuccess,
    isError: base.isError,
    isPending: base.isPending,
    fetchStatus: base.fetchStatus,
    isFetching: base.isFetching,
    isLoading: base.isLoading,
    refetch: base.refetch,
  }
}
export type UseMutationProps<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = Pick<
  MutationObserverOptions<TData, TError, TVariables, TContext>,
  'onSuccess' | 'onError' | 'onMutate' | 'onSettled'
>

export type UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = Pick<
  UseMutationReturnType<TData, TError, TVariables, TContext>,
  | 'data'
  | 'error'
  | 'isError'
  | 'isIdle'
  | 'isPending'
  | 'isPaused'
  | 'isSuccess'
  | 'reset'
  | 'mutate'
  | 'mutateAsync'
  | 'status'
  | 'variables'
>

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  args: UseMutationOptions_<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const base = _useMutation(args)

  return {
    data: base.data,
    error: base.error,
    reset: base.reset,
    isError: base.isError,
    isIdle: base.isIdle,
    isPending: base.isPending,
    isSuccess: base.isSuccess,
    isPaused: base.isPaused,
    mutate: base.mutate,
    mutateAsync: base.mutateAsync,
    status: base.status,
    variables: base.variables,
  }
}
