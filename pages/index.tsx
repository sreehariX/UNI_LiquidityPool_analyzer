import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery, gql } from '@apollo/client';
import client from '../apolloclient';  // Import the Apollo Client instance

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Simple Table component (same as before)
const Table = ({ children }) => <table className="min-w-full divide-y divide-gray-200">{children}</table>;
// Define TableHeader, TableBody, TableRow, TableHead, TableCell similarly...

const LIQUIDITY_EVENTS_QUERY = gql`
  query LiquidityEvents($startTime: Int!, $endTime: Int!) {
    swaps(
      first: 100,
      orderBy: timestamp,
      orderDirection: desc,
      where: { timestamp_gte: $startTime, timestamp_lte: $endTime }
    ) {
      pool {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      amount0
      amount1
      amountUSD
    }
  }
`;

const UniswapLiquidityFlowAnalyzer = () => {
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [poolActivity, setPoolActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Apollo client to query The Graph subgraph
      const { data } = await client.query({
        query: LIQUIDITY_EVENTS_QUERY,
        variables: {
          startTime: startBlock,
          endTime: endBlock,
        },
      });

      const liquidityEvents = data.swaps;

      const activity = liquidityEvents.reduce((acc, event) => {
        const poolKey = `${event.pool.token0.symbol}-${event.pool.token1.symbol}`;
        if (!acc[poolKey]) {
          acc[poolKey] = { name: poolKey, adds: 0, removes: 0 };
        }

        // Using 'amountUSD' to calculate adds/removes for simplicity
        acc[poolKey].adds += parseFloat(event.amountUSD);
        return acc;
      }, {});

      setPoolActivity(Object.values(activity));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAdded = poolActivity.reduce((sum, pool) => sum + pool.adds, 0);

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-800">Uniswap Liquidity Flow Analyzer</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl text-purple-700 mb-4">Block Range Selection</h2>
        <div className="flex space-x-4">
          <input
            type="number"
            value={startBlock || ''}
            onChange={(e) => setStartBlock(parseInt(e.target.value))}
            placeholder="Start Block"
            className="flex-grow border rounded p-2"
          />
          <input
            type="number"
            value={endBlock || ''}
            onChange={(e) => setEndBlock(parseInt(e.target.value))}
            placeholder="End Block"
            className="flex-grow border rounded p-2"
          />
          <button onClick={fetchData} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Analyze
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {poolActivity.length > 0 && (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl text-purple-700 mb-4">Liquidity Flow Overview</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Total Liquidity Added:
                  <span className="text-green-600 ml-2">{totalAdded.toFixed(2)}</span>
                </p>
              </div>
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={poolActivity}
                    dataKey="adds"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {poolActivity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl text-purple-700 mb-4">Top Liquidity Events</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poolActivity
                  .sort((a, b) => b.adds - a.adds)
                  .slice(0, 5)
                  .map((pool, index) => (
                    <TableRow key={pool.name}>
                      <TableCell>{pool.name}</TableCell>
                      <TableCell><span className="text-green-600">Add</span></TableCell>
                      <TableCell>{pool.adds.toFixed(4)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <UniswapLiquidityFlowAnalyzer />
    </div>
  );
};
