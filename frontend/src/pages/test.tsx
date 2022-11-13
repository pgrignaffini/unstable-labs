import React from 'react'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { baseUrl } from '../utils/constants'

type Request = {
    job_count: number
    job_hash: string
    job_no: number
}

type Progress = {
    current_image: string,
    eta_relative: number,
    progress: number,
    state: {
        interrupted: boolean,
        job: string,
        job_count: number,
        job_no: number,
        sampling_step: number,
        sampling_steps: number,
        skipped: boolean,
        done: boolean,
    }
}

type Style = {
    name: string,
    prompt: string,
    negative_prompt: string,
}

function TestPage({ styles }: { styles: Style[] }) {

    const [prompt, setPrompt] = React.useState('')
    const [selectedStyle, setSelectedStyle] = React.useState<string>('')
    const [selectedImage, setSelectedImage] = React.useState<string>('')
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [request, setRequest] = React.useState<Request | undefined>(undefined)
    const [progress, setProgress] = React.useState<Progress | undefined>(undefined)
    const queryClient = useQueryClient()

    // console.log({ prompt, selectedStyle, selectedImage, selectedModel })

    const getPreview = async () => {
        const response = await axios.get("/api/stable-diffusion/get-previews", {
            params: {
                style: selectedStyle,
            }
        }).catch((err) => {
            console.log(err)
        })
        return response?.data.base64
    }

    // const { data: preview } = useQuery("preview", getPreview, {
    //     enabled: selectedStyle !== '',
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: false,
    //     onSuccess: (data) => {
    //         console.log("preview", data)
    //     }
    // })


    const checkProgress = async (req: Request) => {
        if (!req) return
        const response = await axios.get("/api/stable-diffusion/check-progress", {
            params: { job_no: req.job_no }
        }).catch((err) => {
            console.log(err)
            return
        })
        let progress: Progress = response?.data
        progress.state.done = false
        console.log("Progress", progress)
        if (progress.state.job_no === req.job_no &&
            progress.state.job !== req.job_hash) progress.state.done = true
        if (progress.state.job_no === 0 &&
            progress.state.job_count === 0) progress.state.done = true
        return progress
    }

    const { data: progressData } = useQuery("progress", () => checkProgress(request as Request), {
        enabled: !!request && (progress?.state.done === false || progress === undefined),
        refetchInterval: 1000,
        onSuccess(data) {
            setProgress(data)
        },
    })

    const getImages = async () => {
        const response = await axios.get("/api/stable-diffusion/get-images", {
            params: { job_hash: request?.job_hash },
        }).catch((err) => {
            console.log(err)
        })
        const images = response?.data.split("\n")
        console.log("Images", images)
        return images
    }

    const { data: images } = useQuery("images", getImages, {
        enabled: !!progress && progress.state.done,
        onSuccess: () => {
            setRequest(undefined)
            setProgress(undefined)
        }
    })

    const text2Image = async () => {
        if (!prompt || !selectedStyle) return
        const response = await axios.post("/api/stable-diffusion/txt2img", {
            prompt,
            style: selectedStyle,
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setRequest(response?.data)
        return response
    }

    const image2Image = async () => {
        if (!prompt || !selectedStyle || !selectedImage) return
        const response = await axios.post("/api/stable-diffusion/img2img", {
            prompt,
            style: selectedStyle,
            image: selectedImage,
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setRequest(response?.data)
        return response
    }

    return (
        <div className='min-h-screen p-10 space-y-10'>
            <div className='flex space-x-4 justify-center'>
                {styles && <select className='p-2 font-pixel text-black' onChange={(e) => {
                    setSelectedStyle(e.target.value)
                    // queryClient.invalidateQueries("preview")
                }}>
                    {styles?.map((style: any) => (
                        <option key={style.name} value={style.name}>{style.name}</option>
                    ))}
                </select>}
                <input onChange={(e) => setPrompt(e.target.value)}
                    className='p-2 bg-white font-pixel outline-none text-black' id='prompt' placeholder='Prompt' />
            </div>
            <div className='flex justify-center'>
                {/* {preview && <img src={`data:image/.png;base64,${preview}`} alt="preview" className='w-48' />} */}
            </div>
            <div className='flex space-x-5 justify-center items-center'>
                <button className='p-2 font-pixel text-white bg-acid hover:bg-dark-acid' onClick={text2Image}>
                    Txt2Img
                </button>
                <button className='p-2 font-pixel text-white bg-acid hover:bg-dark-acid' onClick={image2Image}>
                    Img2Img
                </button>
            </div>
            {selectedImage ?
                <div className='flex space-x-6 items-center'>
                    <p className='font-pixel text-sm text-white'>Selected image:</p>
                    <img className='w-12' src={`data:image/.webp;base64,${selectedImage}`} />
                </div> : null}
            {progressData ? <p className="font-pixel text-sm text-center">Wait time: {progress?.eta_relative.toFixed(0)}s</p> : null}
            <div className='grid grid-cols-4 gap-4'>
                {images && images.map((image: string, index: number) => {
                    return (
                        <img className={`cursor-pointer hover:border-4 hover:border-acid ${selectedImage === image ? "border-4 border-acid" : null}`} onClick={() => setSelectedImage(image)}
                            key={index} src={`data:image/.webp;base64,${image}`} />
                    )
                })}
            </div>
        </div>
    )
}

// get styles from server side and pass to client
export async function getServerSideProps() {
    const styles = await axios.get(`${baseUrl}/sdapi/v1/prompt-styles`)
        .catch((err) => {
            console.log(err)
        })
    return {
        props: {
            styles: styles?.data,
        }
    }
}

export default TestPage 