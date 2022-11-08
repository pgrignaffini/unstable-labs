import React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import type { Generation, Status, Option } from "../../typings"
import { options } from "../utils/options"


function TestPage() {

    const [requestID, setRequestID] = React.useState<string | null>(null)
    const [generatedImages, setGeneratedImages] = React.useState<Generation[]>([])
    const [status, setStatus] = React.useState<Status | null>(null)
    const [image, setImage] = React.useState<string | null>(null)

    const baseUrl = "https://rtwlk1dnr3x6tp-64410a29-3000.proxy.runpod.io/"

    const getModels = async () => {
        axios.get("https://rtwlk1dnr3x6tp-64410a29-3000.proxy.runpod.io/sdapi/v1/sd-models")
            .then((res) => {
                console.log(res.data)
                return res.data
            }).catch((err) => {
                console.log(err)
            })
    }

    const { data: models, isLoading: modelsLoading, error: modelsError } = useQuery('models', getModels)

    // const generate = async (prompt: string) => {
    //     setGeneratedImages([])
    //     setRequestID(null)
    //     setStatus(null)
    //     axios.post('https://stablehorde.net/api/v2/generate/async', {
    //         prompt: prompt,
    //         params: selected?.params,
    //     }, {
    //         headers: {
    //             'apikey': process.env.NEXT_PUBLIC_STABLE_HORDE_API_KEY
    //         }
    //     }).then(function (response) {
    //         console.log(response);
    //         setRequestID(response.data.id)
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // const checkStatus = async () => {
    //     if (requestID) {
    //         axios.get(`https://stablehorde.net/api/v2/generate/check/${requestID}`, {
    //         }).then(function (response) {
    //             console.log(response.data);
    //             setStatus(response.data)
    //         }).catch(function (error) {
    //             console.log(error);
    //         });
    //     }
    // }

    // useQuery('checkStatus', checkStatus, {
    //     enabled: requestID !== null,
    //     refetchInterval: requestID !== null ? 1000 : false
    // })

    // const retrieveImages = async () => {
    //     axios.get(`https://stablehorde.net/api/v2/generate/status/${requestID}`, {
    //     }).then(function (response) {
    //         console.log(response);
    //         setGeneratedImages(response.data.generations)
    //         setRequestID(null)
    //         setStatus(null)
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // useQuery('retrieveImages', retrieveImages, {
    //     enabled: status?.done,
    // })

    // const [selected, setSelected] = React.useState<Option | undefined>(options[0])

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault()
    //     let newPrompt = selected?.prompt
    //     selected?.placeholders.map((_, index) => {
    //         const userInput = (document.getElementById(`input-${index}`) as HTMLInputElement).value
    //         newPrompt = newPrompt?.replace(`${index}`, userInput)
    //     })
    //     console.log("New prompt " + newPrompt)
    //     generate(newPrompt!)
    // }

    // const text2Image = () => {
    //     axios.post('https://t402ufstkbijfn-64410ba0-3000.proxy.runpod.io/sdapi/v1/txt2img', {
    //         prompt: "tiny cute super mario toy, standing character, soft smooth lighting, soft pastel colors, skottie young, 3d blender render, polycount, modular export constructivism, pop surrealism, physically based rendering, square image",
    //     }, {
    //         headers: {
    //             'accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then(function (response) {
    //         console.log(response.data.images[0]);
    //         setImage(response.data.images[0])
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // const { data, isLoading } = useQuery('text2Img', text2Image, {
    //     enabled: true,
    // })

    // console.log(isLoading)

    return (
        <></>
        // <div className='min-h-screen flex justify-center items-center'>
        //     <div className='flex flex-col justify-center space-y-10'>
        //         <div className='flex flex-col justify-center space-y-2'>
        //             <label className='text-xl font-bold'>Select Prompt</label>
        //             <select onChange={(e) => setSelected(JSON.parse(e.target.value))} className='border-2 border-gray-300 rounded-md p-2'>
        //                 {options.map(option => (
        //                     <option key={option.value} value={JSON.stringify(option)}>
        //                         {option.label}
        //                     </option>
        //                 ))}
        //             </select>
        //             {selected &&
        //                 <form className='flex space-x-5 items-center' onSubmit={handleSubmit}>
        //                     {selected?.placeholders?.map((key, index) => (
        //                         <input key={key} id={`input-${index}`} className='border-2 border-gray-300 rounded-md p-2' placeholder={key} />
        //                     ))}
        //                     <button type='submit' className='bg-blue-500 text-white rounded-md p-2'>Generate</button>
        //                 </form>
        //             }
        //         </div>
        //         {status &&
        //             <div className='flex space-x-4'>
        //                 <p>Wait time: {status.wait_time}</p>
        //                 <p>{`${status && status.processing <= 0 ? "Queuing the request" : "Queued"}`}</p>
        //                 {status && status.processing > 0 && <p>{`Processing: ${status.processing} images`}</p>}
        //                 {status && status.finished > 0 && <p>{`Finished rendering: ${status.finished} images`}</p>}
        //             </div>
        //         }
        //         {
        //             generatedImages?.map((generation, index) => {
        //                 return (
        //                     <div className='flex flex-col space-y-2' key={index}>
        //                         <img src={"data:image/.webp;base64," + generation.img} alt="image" />
        //                     </div>
        //                 )
        //             })
        //         }
        //     </div>
        //     <img src={"data:image/.webp;base64," + image} alt="image" />
        // </div>
    )
}

export default TestPage