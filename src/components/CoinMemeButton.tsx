import { useEffect, useState } from "react";
import {
  createMetadataBuilder,
  createZoraUploaderForCreator,
  createCoinCall,
  getCoinCreateFromLogs,
  DeployCurrency,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { Address } from "viem";
import {
  useAccount,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { base } from "viem/chains";
import { getTransactionReceipt } from "wagmi/actions";
import { config } from "./providers";
import { ArrowUp, ArrowUpRightIcon } from "lucide-react";

const CoinMemeButton = (imageBlob: { imageBlob: string }) => {
  const { address, isConnected } = useAccount();
  const [contractCallParams, setContractCallParams] = useState<any>(null);
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>();
  const [receipt, setReceipt] = useState<any>(null);
  const [coinAddress, setCoinAddress] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Form fields
  const [coinName, setCoinName] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinDescription, setCoinDescription] = useState("");

  const {
    writeContract,
    data: writeResult,
    status: writeStatus,
    error: writeError,
  } = useWriteContract();

  const {
    data: simData,
    status: simStatus,
    error: simError,
  } = useSimulateContract({
    address: contractCallParams?.address,
    abi: contractCallParams?.abi,
    functionName: contractCallParams?.functionName,
    args: contractCallParams?.args,
    value: contractCallParams?.value,
    query: {
      enabled: !!contractCallParams,
    },
  });

  const handleWrite = () => {
    if (!simData?.request) {
      console.warn("⚠️ Simulation not ready");
      return;
    }
    writeContract(simData.request);
  };

  async function fetchReceipt(hash: `0x${string}`) {
    try {
      const txnReceipt = await getTransactionReceipt(config, {
        hash: hash,
        chainId: base.id,
      });
      console.log("📜 Receipt fetched:", txnReceipt);
      setReceipt(txnReceipt);
    } catch (error) {
      console.error("❌ Error fetching receipt:", error);
    }
  }

  const handleCreateCoin = async () => {
    if (!coinName || !coinSymbol || !coinDescription) {
      alert("Please fill out all fields");
      return;
    }
    try {
      if (!address) {
        alert("Please connect your wallet");
        return;
      }
      console.log("🔄 Fetching logo...");
      setIsPreparing(true);
      const res = await fetch(imageBlob.imageBlob);
      const blob = await res.blob();
      const file = new File([blob], imageBlob.imageBlob, { type: "image/png" });

      console.log("Imgage file created:", file);

      setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY!);

      console.log("📦 Uploading metadata...");
      const uploader = createZoraUploaderForCreator(address as Address);

      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(coinName)
        .withSymbol(coinSymbol.toUpperCase())
        .withDescription(coinDescription)
        .withImage(file)
        .upload(uploader);

      console.log("✅ Metadata uploaded:", createMetadataParameters);

      const coinParams = {
        ...createMetadataParameters,
        payoutRecipient: address as Address,
        currency: DeployCurrency.ZORA,
        chainId: base.id,
      };

      const callParams = await createCoinCall(coinParams);
      console.log("🛠️ Contract call ready:", callParams);

      setContractCallParams(callParams);
    } catch (err) {
      console.error("❌ Error creating coin:", err);
    } finally {
      setIsPreparing(false);
    }
  };

  useEffect(() => {
    if (writeResult) {
      console.log("📦 Txn Hash:", writeResult);
      fetchReceipt(writeResult as `0x${string}`);
      setTxnHash(writeResult as `0x${string}`);
    }
  }, [writeResult]);

  useEffect(() => {
    console.log("Receipt changes useEffect triggered");
    if (receipt) {
      console.log("📜 Receipt:", receipt);
      const coinDeployment = getCoinCreateFromLogs(receipt);
      console.log("✅ Coin deployed at:", coinDeployment?.coin);
      setCoinAddress(coinDeployment?.coin as `0x${string}`);
      setIsDeployed(true);
    }
  }, [receipt]);

  return (
    <div className="">
      {isConnected && !isDeployed && (
        <>
          {!contractCallParams && (
            <div className="space-y-3">
              <input
                type="text"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="Coin Name (e.g. PepeCoin)"
                className="w-full px-4 py-2 border rounded-lg"
                disabled={isPreparing}
              />
              <input
                type="text"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
                placeholder="Symbol (e.g. PEPE)"
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={6}
                disabled={isPreparing}
              />
              <textarea
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full px-4 py-2 border rounded-lg resize-none"
                rows={3}
                disabled={isPreparing}
              />
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleCreateCoin}
                  disabled={isPreparing}
                  className="px-4 py-2 rounded-lg disabled:opacity-50 text-center"
                >
                  {isPreparing ? (
                    <span className="font-semibold text-gray-800 bg-gray-200 rounded-lg px-6 py-3">
                      {" "}
                      Preparing...{" "}
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg">
                      {" "}
                      🪙 Coin the Meme
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {contractCallParams && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleWrite}
                disabled={!simData?.request || writeStatus === "pending"}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {writeStatus === "pending" ? "Creating..." : "Confirm & Create"}
              </button>
            </div>
          )}
        </>
      )}

      {isDeployed && txnHash && (
        <div className="flex flex-col gap-2 items-center justify-center mt-4">
          <p className="">
            ✅ Deployed Coin :
            <a
              className="underline text-blue-500 ml-2 inline-block"
              href={`https://zora.co/coin/base:${coinAddress}`}
              target="_blank"
            >
              Trade Now on Zora <ArrowUpRightIcon className="inline h-4 w-4" />
            </a>
          </p>
          <p className="text-sm mt-2 ">
            ⛓️ Txn Hash :{" "}
            <a
              href={`https://basescan.org/tx/${txnHash}`}
              className="underline text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {txnHash.slice(0, 6)}...{txnHash.slice(-4)}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CoinMemeButton;
