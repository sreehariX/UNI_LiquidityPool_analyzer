// types/uniswap.ts
export interface Token {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
  }
  
  export interface Pool {
    id: string;
    token0: Token;
    token1: Token;
    feeTier: number;
  }
  
  export interface Mint {
    id: string;
    amount0: string;
    amount1: string;
    pool: Pool;
  }
  
  export interface Burn {
    id: string;
    amount0: string;
    amount1: string;
    pool: Pool;
  }
  
  export interface LiquidityEventsResponse {
    mints: Mint[];
    burns: Burn[];
  }