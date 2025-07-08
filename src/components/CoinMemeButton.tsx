'use client'

import { useEffect, useState } from 'react'
import {
  createMetadataBuilder,
  createZoraUploaderForCreator,
  createCoinCall,
  getCoinCreateFromLogs,
  DeployCurrency,
  setApiKey,
} from '@zoralabs/coins-sdk'
import { Address } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { base, baseSepolia } from 'viem/chains'

const CoinMemeButton = (imageBlob: { imageBlob: string }) => {
  const { address, isConnected } = useAccount()
  const [contractCallParams, setContractCallParams] = useState<any>(null)
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)

  // Form fields
  const [coinName, setCoinName] = useState('')
  const [coinSymbol, setCoinSymbol] = useState('')
  const [coinDescription, setCoinDescription] = useState('')

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
      console.log("📜 Receipt:", receipt);
      const coinDeployment = getCoinCreateFromLogs(receipt);
      console.log('✅ Coin deployed at:', coinDeployment?.coin);
      setIsDeployed(true);
    }
  }, [receipt]);


  const handleCreateCoin = async () => {
    if (!coinName || !coinSymbol || !coinDescription) {
      alert('Please fill out all fields')
      return
    }
    try {
      if (!address) {
        alert('Please connect your wallet')
        return
      }
      console.log('🔄 Fetching logo...')
      setIsPreparing(true)
      const res = await fetch(imageBlob.imageBlob)
      const blob = await res.blob()
      const file = new File([blob], imageBlob.imageBlob, { type: 'image/png' })

      console.log("Imgage file created:", file)

      setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY!)

      console.log('📦 Uploading metadata...')
      const uploader = createZoraUploaderForCreator(address as Address)

      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(coinName)
        .withSymbol(coinSymbol.toUpperCase())
        .withDescription(coinDescription)
        .withImage(file)
        .upload(uploader)

      console.log('✅ Metadata uploaded:', createMetadataParameters)

      const coinParams = {
        ...createMetadataParameters,
        payoutRecipient: address as Address,
        currency: DeployCurrency.ZORA,
        chainId: base.id,

      }

      const callParams = await createCoinCall(coinParams)
      console.log('🛠️ Contract call ready:', callParams)

      setContractCallParams(callParams)
    } catch (err) {
      console.error('❌ Error creating coin:', err)
    } finally {
      setIsPreparing(false)
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
                  {isPreparing ? <span className='font-semibold text-gray-800 bg-gray-200 rounded-lg px-6 py-3'> Preparing... </span> : <span className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg'> 🪙 Coin the Meme</span>}
                </button>
              </div>
            </div>
          )}


          {contractCallParams && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleWrite}
                disabled={!simData?.request || writeStatus === 'pending'}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {writeStatus === 'pending' ? 'Creating...' : 'Confirm & Create'}
              </button>
            </div>
          )}
        </>
      )}

      {isDeployed && txnHash && (
        <div className="flex justify-center mt-4">
          <p className="text-sm mt-2 ">
            ⛓️ Txn:{' '}
            <a
              href={`https://basescan.org/tx/${txnHash}`}
              className="underline text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {txnHash}
            </a>
            <br />
            {(() => {
              const coinDeployment = receipt ? getCoinCreateFromLogs(receipt) : undefined
              return coinDeployment?.coin ? (
                <span className=''> ✅ Deployed Coin:<a className='font-bold text-green-900' href={`https://zora.co/coin/base:${coinDeployment.coin}`} target='_blank'>{coinDeployment.coin}</a></span>
              ) : null
            })()}
          </p>
        </div>
      )}
    </div>
  )
}

export default CoinMemeButton