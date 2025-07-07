'use client'

import { useEffect, useState } from 'react'
import {
  createMetadataBuilder,
  createZoraUploaderForCreator,
  createCoinCall,
  getCoinCreateFromLogs,
  DeployCurrency,
  InitialPurchaseCurrency,
  setApiKey,
} from '@zoralabs/coins-sdk'
import { Address, parseEther } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { baseSepolia } from 'viem/chains'

export default function CreateTestPage() {
  const { address, isConnected } = useAccount()
  const [contractCallParams, setContractCallParams] = useState<any>(null)
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined)

  const { writeContract, data: writeResult, status: writeStatus, error: writeError } = useWriteContract()

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: txnHash,
    query: { enabled: !!txnHash },
  })

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
  })

  useEffect(() => {
    if (writeResult) {
      console.log('📦 Txn Hash:', writeResult)
      setTxnHash(writeResult)
    }
  }, [writeResult])

  useEffect(() => {
    if (receipt) {
      const coinDeployment = getCoinCreateFromLogs(receipt)
      console.log('✅ Coin deployed at:', coinDeployment?.coin)
    }
  }, [receipt])

  const handleCreateCoin = async () => {
    try {
      if (!address) {
        alert('Please connect your wallet')
        return
      }

      console.log('🔄 Fetching logo...')
      const res = await fetch('/logo.png')
      const blob = await res.blob()
      const file = new File([blob], 'logo.png', { type: 'image/png' })

      setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY!)

      console.log('📦 Uploading metadata...')
      const uploader = createZoraUploaderForCreator(address as Address)

      const { createMetadataParameters } = await createMetadataBuilder()
        .withName('Test Coin')
        .withSymbol('TCOIN')
        .withDescription('Test coin deployed via Next.js')
        .withImage(file)
        .upload(uploader)

      console.log('✅ Metadata uploaded:', createMetadataParameters)

      const coinParams = {
        ...createMetadataParameters,
        payoutRecipient: address as Address,
        currency: DeployCurrency.ETH,
        chainId: baseSepolia.id,

      }

      const callParams = await createCoinCall(coinParams)
      console.log('🛠️ Contract call ready:', callParams)

      setContractCallParams(callParams)
    } catch (err) {
      console.error('❌ Error creating coin:', err)
    }
  }

  const handleWrite = () => {
    if (!simData?.request) {
      console.warn('⚠️ Simulation not ready')
      return
    }
    writeContract(simData.request)
  }

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🪙 Zora Coin Creator</h1>
      <ConnectKitButton />

      {isConnected && (
        <>
          <button
            onClick={handleCreateCoin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Step 1: Prepare Coin
          </button>

          <button
            onClick={handleWrite}
            disabled={!simData?.request || writeStatus === 'pending'}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {writeStatus === 'pending' ? 'Creating...' : 'Step 2: Confirm & Create'}
          </button>
        </>
      )}

      {txnHash && (
        <p className="text-sm mt-2">
          ⛓️ Txn:{' '}
          <a
            href={`https://sepolia.basescan.org/tx/${txnHash}`}
            className="underline"
            target="_blank"
          >
            {txnHash}
          </a>
        </p>
      )}

      {writeError && (
        <p className="text-red-500 mt-2">❌ Error: {writeError.message}</p>
      )}

      {simStatus === 'error' && (
        <p className="text-red-500 text-sm">⚠️ Simulation error: {simError?.message}</p>
      )}

      {simStatus === 'success' && <p className="text-green-600 text-sm">✅ Simulation ready</p>}
    </div>
  )
}
