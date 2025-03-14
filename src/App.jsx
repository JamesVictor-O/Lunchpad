import React from "react";
import { RouterProvider } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createBrowserRouter, createRoutesFromElements,Route } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import { WagmiProvider} from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";

function App() {
  const lisk = {
    id: 4202,
    name: 'Lisk Sepolia Testnet',
    network: 'lisk-testnet',
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.sepolia-api.lisk.com/'],
      },
      public: {
        http: ['https://rpc.sepolia-api.lisk.com/'],
      },
    },
    blockExplorers: {
      default: { name: 'Lisk Explorer', url: 'https://sepolia-blockscout.lisk.com/' },
    },
    testnet: true,
  };
  

  const queryClient = new QueryClient();
  const config = getDefaultConfig({
    appName: "My RainbowKit App", 
    projectId: "YOUR_PROJECT_ID",
    chains: [lisk],
  });

  const router=createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<LandingPage/>}>
            <Route index element={<LandingPage/>}/>
        </Route>
    )
)
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
