import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt } from '@wagmi/core'
import { contractAddress } from "../utils/contractAddress";
import contractAbi from "../contractAbi";

const LandingPage = () => {
  const [tokenType, setTokenType] = useState("erc20");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [deployERC20Info, setDeployERC20Info] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending, isErrorWrite } = useWriteContract();
  const { data: hash, error: writeError } = useWriteContract();
const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
});

  const {
    data: deployedErc20Count,
    error: isError,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "deployedErc20Count",
    arg: [],
  });


  useEffect(() => {
    console.log("outcome");
    if (isPending) {
      console.log("Erc20 is lunching...");
    } else if (isErrorWrite) {
      console.error("Erc20 lunch failed:", isError);

      console.error("Error code:", isError.code);
      console.error("Error message:", isError.message);
      console.error("Error data:", isError.data);
    } else if (deployedErc20Count !== undefined) {
      console.log("Erc lunched:", deployedErc20Count);
    }
  }, [deployedErc20Count, isLoading, isError]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!deployERC20Info.name.trim()) {
  //     alert("Please enter a token name");
  //     return;
  //   }

  //   if (!deployERC20Info.symbol.trim()) {
  //     alert("Please enter a token symbol");
  //     return;
  //   }

  //   if (
  //     !deployERC20Info.totalSupply ||
  //     isNaN(Number(deployERC20Info.totalSupply))
  //   ) {
  //     alert("Please enter a valid number for total supply");
  //     return;
  //   }

    
  //   const confirmed = window.confirm(
  //     `Are you sure you want to deploy a token with the following details?\n\nName: ${deployERC20Info.name}\nSymbol: ${deployERC20Info.symbol}\nTotal Supply: ${deployERC20Info.totalSupply}`
  //   );

  //   if (!confirmed) {
  //     return;
  //   }
  //   console.log(deployERC20Info.totalSupply)
  //   if (tokenType == "erc20") {
      
  //     setIsSubmitting(true);
  //     setSuccess(false);
  //     try {
  //       await writeContractAsync({
  //         address: contractAddress,
  //         abi: contractAbi,
  //         functionName: "deployErc20",
  //         args: [
  //           deployERC20Info.name,
  //           deployERC20Info.symbol,
  //           address,
  //           deployERC20Info.totalSupply,
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error details:", error);
  //       console.error("Error code:", error.code);
  //       console.error("Error message:", error.message);
  //       console.error("Error data:", error.data);

  //       alert("Failed to deploy token. See console for details.");
  //     } finally {
  //       setIsSubmitting(false);
  //       setDeployERC20Info((prev) => ({
  //         name: "",
  //         symbol: "",
  //         totalSupply: "",
  //       }));
  //     }
  //   }else{
  //     console.log("okay")
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!deployERC20Info.name.trim()) {
      alert("Please enter a token name");
      return;
    }

    if (!deployERC20Info.symbol.trim()) {
      alert("Please enter a token symbol");
      return;
    }

    if (
      !deployERC20Info.totalSupply ||
      isNaN(Number(deployERC20Info.totalSupply))
    ) {
      alert("Please enter a valid number for total supply");
      return;
    }

    // Maybe add a confirmation dialog before proceeding
    const confirmed = window.confirm(
      `Are you sure you want to deploy a token with the following details?\n\nName: ${deployERC20Info.name}\nSymbol: ${deployERC20Info.symbol}\nTotal Supply: ${deployERC20Info.totalSupply}`
    );

    if (!confirmed) {
      return;
    }
  
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "deployErc20",
        args: [
          deployERC20Info.name,
          deployERC20Info.symbol,
          address,
          deployERC20Info.totalSupply,
        ],
      });
  
      console.log("Transaction hash:", hash);
  
      // Wait for the transaction to be confirmed
      const receipt = await waitForTransactionReceipt({ hash });
      console.log("Transaction receipt:", receipt);
  
      if (receipt.status === "success") {
        setSuccess(true);
        console.log("Token deployed successfully!");
      } else {
        console.error("Transaction failed:", receipt);
      }
    } catch (error) {
      console.error("Error details:", error);
      alert("Failed to deploy token. See console for details.");
    } finally {
      setIsSubmitting(false);
      setDeployERC20Info({
        name: "",
        symbol: "",
        totalSupply: "",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Token Launch
            </h1>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg px-4 py-2  border border-yellow-600 shadow-sm hover:shadow-glow-gold transition-all duration-300">
              <ConnectButton.Custom>
                {({ account, openAccountModal, openConnectModal, mounted }) => {
                  const connected = mounted && account;

                  return (
                    <div>
                      {connected ? (
                        <button
                          onClick={openAccountModal}
                          className="flex items-center"
                        >
                          <span className="text-white font-medium">
                            {account.displayName}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={openConnectModal}
                          className="flex items-center"
                        >
                          <span className="text-white font-medium">
                            Connect Wallet
                          </span>
                        </button>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
                Launch Your Token to the Moon 🚀
              </h2>

              <div className="flex mb-6 bg-gray-900/80 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    tokenType === "erc20"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setTokenType("erc20")}
                >
                  ERC-20 Token
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    tokenType === "erc721"
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setTokenType("erc721")}
                >
                  ERC-721 NFT
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Token Name
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.name}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Cosmic Coin"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.symbol}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      placeholder="e.g. COSM"
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Total Supply
                    </label>
                    <input
                      type="text"
                      value={deployERC20Info.totalSupply}
                      onChange={(e) =>
                        setDeployERC20Info((prev) => ({
                          ...prev,
                          totalSupply: e.target.value,
                        }))
                      }
                      placeholder={
                        tokenType === "erc20" ? "e.g. 1000000" : "e.g. 10000"
                      }
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  {tokenType === "erc721" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Base URL (for metadata)
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="e.g. https://mynft.com/metadata/"
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    {isConnected ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                          !isConnected
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : isSubmitting
                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white cursor-wait animate-pulse"
                            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-pink-500/25"
                        }`}
                      >
                        {isSubmitting ? "Launching... 🚀" : "Launch Token 🚀"}
                      </button>
                    ) : (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg px-4 py-2  border border-yellow-600 shadow-sm hover:shadow-glow-gold transition-all duration-300">
                        <ConnectButton.Custom>
                          {({
                            account,
                            openAccountModal,
                            openConnectModal,
                            mounted,
                          }) => {
                            const connected = mounted && account;

                            return (
                              <div>
                                {connected ? (
                                  <button
                                    onClick={openAccountModal}
                                    className="flex items-center"
                                  >
                                    <span className="text-white font-medium">
                                      {account.displayName}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={openConnectModal}
                                    className="flex items-center"
                                  >
                                    <span className="text-white font-medium">
                                      Connect Wallet
                                    </span>
                                  </button>
                                )}
                              </div>
                            );
                          }}
                        </ConnectButton.Custom>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {success && (
                <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <p className="text-green-400 font-medium">
                    🎉 Success! Your token has been deployed!
                  </p>
                  <p className="text-sm text-gray-300 mt-1 break-all">
                    Address: {deployedAddress}
                  </p>
                </div>
              )}

              {!isConnected && (
                <p className="mt-4 text-sm text-gray-400 text-center">
                  Please connect your wallet to launch a token
                </p>
              )}
            </div>

            <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-indigo-900/50 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Gas fees will apply when deploying your token contract
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
