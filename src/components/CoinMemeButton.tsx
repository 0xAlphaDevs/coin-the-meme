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
import { ConnectKitButton } from 'connectkit'
import { baseSepolia } from 'viem/chains'

const CoinMemeButton = (imageBlob: { imageBlob: string }) => {
  const { address, isConnected } = useAccount()
  const [contractCallParams, setContractCallParams] = useState<any>(null)
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
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
      setIsDeployed(true)
    }
  }, [receipt])

  const handleCreateCoin = async () => {
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
            <button
              onClick={handleCreateCoin}
              disabled={isPreparing}
              className="px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isPreparing ? <span className='font-semibold text-gray-800 bg-gray-200 rounded-lg px-6 py-3'> Preparing... </span> : <span className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg'> 🪙 Coin the Meme</span>}
            </button>
          )}


          {contractCallParams && (
            <button
              onClick={handleWrite}
              disabled={!simData?.request || writeStatus === 'pending'}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {writeStatus === 'pending' ? 'Creating...' : 'Confirm & Create'}
            </button>
          )}
        </>
      )}

      {isDeployed && txnHash && (
        <p className="text-sm mt-2 ">
          ⛓️ Txn:{' '}
          <a
            href={`https://sepolia.basescan.org/tx/${txnHash}`}
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
              <p className=''> ✅ Deployed Coin:<a className='font-bold text-green-900' href={`https://testnet.zora.co/coin/bsep:${coinDeployment.coin}`} target='_blank'>{coinDeployment.coin}</a></p>
            ) : null
          })()}
        </p>
      )}
    </div>
  )
}

export default CoinMemeButton