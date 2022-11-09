import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import ResultCarousel from "../components/ResultCarousel";
import { useQuery } from "react-query";
import SolidButton from "../components/SolidButton";
import axios from "axios";
import Vials from "../components/Vials";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import vialContractInfo from "../../../contracts/abi/vialNFT.json";
import type { Generation, Status, Option, Vial } from "../../typings"
import { options } from "../utils/options"
import { Type } from "../utils/constants";
import { generateImages, checkStatus, retrieveImages } from "../utils/stableDiffusion";
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react'
import Airdrop from "../components/Airdrop";

const Home: NextPage = () => {

  const { data: session } = useSession()
  const [vialToBurn, setVialToBurn] = React.useState<Vial | undefined>(undefined);
  const [selectedOption, setSelectedOption] = React.useState<Option | undefined>(undefined)
  const [prompt, setPrompt] = React.useState<string>("")
  const [requestID, setRequestID] = React.useState<string | undefined>(undefined)
  const [generatedImages, setGeneratedImages] = React.useState<Generation[] | undefined>(undefined)
  const [status, setStatus] = React.useState<Status | undefined>(undefined)
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false)

  // set selected option based on vialToBurn type
  React.useEffect(() => {
    if (vialToBurn) {
      const option = options.find(option => option.type === vialToBurn.type)
      setSelectedOption(option)
      console.log("Selected option: ", option?.label)
    }
  }, [vialToBurn])

  // get user from id
  const { data: user } = trpc.useQuery(['user.get-user', {
    id: session?.user?.id || '1'
  }])

  const startGeneration = async (prompt: string) => {
    if (prompt && selectedOption) {
      setIsGenerating(true)
      setGeneratedImages(undefined)
      setRequestID(undefined)
      setStatus(undefined)
      const requestID = await generateImages(prompt, selectedOption)
      setRequestID(requestID)
    }
  }

  useQuery('checkStatus', async () => await checkStatus(requestID), {
    enabled: requestID !== undefined,
    refetchInterval: requestID !== undefined ? 1000 : false,
    onSuccess(data) {
      setStatus(data)
    },
  })

  useQuery('retrieveImages', () => retrieveImages(requestID), {
    enabled: status?.done,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess(data) {
      setGeneratedImages(data)
      setRequestID(undefined)
      setStatus(undefined)
      setIsGenerating(false)
    },
  })

  const { config } = usePrepareContractWrite({
    addressOrName: vialContractInfo.address,
    contractInterface: vialContractInfo.abi,
    functionName: 'burnVial',
    args: [vialToBurn?.tokenId],
    onSuccess(data) {
      console.log('Success', data)
    },
    onError(error) {
      console.log('Error', error)
    }
  })

  const { data, writeAsync: burnVial } = useContractWrite({
    ...config,
    enabled: !!vialToBurn,
    onSuccess(data) {
      console.log('Success', data)
    },
    onError(error) {
      console.log('Error', error)
    }
  })

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (vialToBurn) {
      let newPrompt = selectedOption?.prompt
      selectedOption?.placeholders.map((_, index) => {
        const userInput = (document.getElementById(`input-${index}`) as HTMLInputElement).value
        newPrompt = newPrompt?.replace(`${index}`, userInput)
      })
      console.log("New prompt " + newPrompt)
      await burnVial?.().catch((error) => {
        console.log(error)
        return
      })
      startGeneration(newPrompt!)
      setPrompt(newPrompt!)
      setVialToBurn(undefined)
    }
  }

  const selectVialModal = (
    <>
      <input type="checkbox" id="select-vial-modal" className="modal-toggle" />
      <div className="modal">
        <div className="w-2/3 h-1/3">
          <label htmlFor="select-vial-modal" className="font-pixel text-2xl text-white cursor-pointer"
            onClick={() => setVialToBurn(undefined)}>X</label>
          <div className="bg-gray-400 bg-opacity-50 backdrop-blur-xl p-8">
            <Vials setVialToBurn={setVialToBurn} vialToBurn={vialToBurn} />
            <div className="flex sm:text-center justify-end">
              <label htmlFor="select-vial-modal"
                className="p-2 border-acid border-2 w-fit font-pixel text-lg text-white cursor-pointer hover:bg-slate-400">Select</label>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Head>
        <title>UnstableLabs</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/flask.png" />
      </Head>
      <main className="container mx-auto w-4/5 p-10">
        {selectVialModal}
        <div className="mt-4 relative ">
          <img src="/lab-top.png" alt="lab-top" className="w-full" />
          <div className="w-full absolute bg-black bottom-1/2 ">
            <p className="font-pixel font-bold text-3xl text-white text-center">Welcome to <span className="text-acid">Unstable</span>Labs!</p>
            <p className="font-pixel font-bold text-lg text-gray-400 text-center">a lab to brew AI-generated NFTs</p>
          </div>
        </div>
        <div className="flex mt-10 justify-center items-center ">
          <p className="font-pixel font-bold text-3xl text-white">Step into the Brewery</p>
        </div>
        <img src="/brewery-animated.gif" className="w-72 mx-auto mt-16" />
        <div className="bg-gray-400 p-6 w-2/3 mx-auto mt-16 row-start-3 col-start-3">
          {selectedOption && <p className="font-pixel text-[0.5rem] text-black">{selectedOption.label}</p>}
          <div className="flex items-center space-x-3 justify-between">
            <label htmlFor="select-vial-modal" className="cursor-pointer" >
              <div className="h-12 w-12 border-2 border-acid bg-white">
                {vialToBurn && <img src={vialToBurn.image} alt="vial" className="p-1 h-12 w-12 object-contain" />}
              </div>
            </label>
            {!vialToBurn && <p className="pt-2 font-pixel text-[0.6rem] text-red-500">Please select a vial to start</p>}
            {selectedOption &&
              <form className='flex space-x-5 items-center' onSubmit={handleSubmit}>
                {selectedOption?.placeholders?.map((key, index) => (
                  <input key={key} id={`input-${index}`} className='w-full p-4 placeholder:font-pixel text-black outline-none font-pixel' required placeholder={key} />
                ))}
                <SolidButton text="Brew" type="submit" loading={isGenerating || !status?.done} isFinished={status?.done} />
              </form>
            }
          </div>
        </div>
        {status &&
          <>
            <div className='flex space-x-4 justify-center mt-10'>
              <p className="font-pixel text-sm">Wait time: {status.wait_time}</p>
              <p className="font-pixel text-sm">{`${status.processing <= 0 ? "Queuing the request" : "Queued"}`}</p>
              {status.processing > 0 && <p className="font-pixel text-sm">{`Processing: ${status.processing} images`}</p>}
              {status.finished > 0 && <p className="font-pixel text-sm">{`Finished rendering: ${status.finished} images`}</p>}
            </div>
            {!status.done && <div className="flex justify-center mt-8">
              <img src="/flask-combining.gif" alt="loading" className="w-64" />
            </div>}
          </>
        }
        {generatedImages &&
          <div className="w-full mt-24">
            <ResultCarousel images={generatedImages} prompt={prompt} generatedByType={selectedOption?.type as Type} />
          </div>}
        {user && !user?.hasClaimedVials &&
          <div className="flex justify-center mt-24">
            <Airdrop user={user} />
          </div>}
        <div className="mt-24 flex justify-evenly">
          <img src="/barrel-toxic.gif" alt="barrel" className="w-24" />
          <img src="/barrels.png" alt="barrels" className="w-56" />
          <img src="/pc-animated.gif" alt="barrels" className="w-48" />
        </div>
      </main>
    </>
  );
};

export default Home;

