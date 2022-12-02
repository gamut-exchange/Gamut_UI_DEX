import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import {
  goerliClient,
} from '../apollo/client'

export const SWAP_TRANSACTIONS = gql`
  query swapTransactions($address: Bytes!) {
    swapEvents(last:5, orderBy: timestamp, orderDirection: desc, where: { sender: $address }, subgraphError: allow) {
      id
      timestamp
      sender
      amountIn
      amountOut
      tokenIn
      tokenOut
      transaction
    }
  }
`

export const JOIN_TRANSACTIONS = gql`
  query joinTransactions($address: Bytes!) {
    joins(last:5, orderBy: timestamp, orderDirection: desc, where: { sender: $address }, subgraphError: allow) {
      id
      timestamp
      sender
      amountsIn
      token0 {
        symbol
        decimals
      }
      token1 {
        symbol
        decimals
      }
      transaction {
        id
      }
    }
  }
`

export const EXIT_TRANSACTIONS = gql`
  query exitTransactions($address: Bytes!) {
    exits(last:5, orderBy: timestamp, orderDirection: desc, where: { sender: $address }, subgraphError: allow) {
      id
      timestamp
      sender
      amountUSD
      liquidity
      value0
      token0 {
        symbol
        decimals
      }
      token1 {
        symbol
        decimals
      }
      transaction {
        id
      }
    }
  }
`

export const POOL_WEIGHTS = gql`
  query poolWeights($address: Bytes!) {
    weightBalanceDatas(last:100, orderBy: timestamp, orderDirection: asc, where: { pool: $address }, subgraphError: allow) {
      id
      timestamp
      weight0
      weight1
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
`

export const POOL_PRICES = (poolString) => {
  return gql`
  query poolTokenPrices {
    poolTokensPrices(last:300, orderBy: timestamp, orderDirection: asc, where: { pool_in: ${poolString} }, subgraphError: allow) {
      id
      timestamp
      token0Price
      token1Price
      pool {
        id
      }
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`
}

/**
 * Fetch swap transactions
 */
 export function useSwapTransactionsData(address) {
  const { loading, error, data } = useQuery(SWAP_TRANSACTIONS, {
    client: goerliClient,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  });
  
  const formattedData = useMemo(() => {
    if (data) {
      return data.swapEvents
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    swaps: formattedData,
  }
}

/**
 * Fetch add liquidity transactions
 */
 export function useJoinTransactionsData(address) {
  const { loading, error, data } = useQuery(JOIN_TRANSACTIONS, {
    client: goerliClient,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  });
  
  const formattedData = useMemo(() => {
    if (data) {
      return data.joins
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    joins: formattedData,
  }
}

/**
 * Fetch remove liquidity transactions
 */
 export function useExitTransactionsData(address, refTime) {
  const { loading, error, data } = useQuery(EXIT_TRANSACTIONS, {
    client: goerliClient,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  });
  
  const formattedData = useMemo(() => {
    if (data) {
      return data.exits
    } else {
      return undefined
    }
  }, [data, refTime])

  return {
    loading: loading,
    error: Boolean(error),
    exits: formattedData,
  }
}

/**
 * Fetch weights
 */
export function useWeightsData(address) {
  const { loading, error, data } = useQuery(POOL_WEIGHTS, {
    client: goerliClient,
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.weightBalanceDatas
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    weights: formattedData,
  }
}

/**
 * Fetch tokenPrices
 */
export function useTokenPricesData(addresses) {
  let poolString = `[`
  addresses.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'
  const { loading, error, data } = useQuery(POOL_PRICES(poolString), {
    client: goerliClient,
    variables: {},
    fetchPolicy: 'cache-first',
  })
  const formattedData = useMemo(() => {
    if (data) {
      return data.poolTokensPrices
    } else {
      return undefined
    }
  }, [data])
  return {
    loading: loading,
    error: Boolean(error),
    prices: formattedData,
  }
}
