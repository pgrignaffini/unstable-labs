import React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

function TestPage() {

    const [prompt, setPrompt] = React.useState('')
    const [styles, setStyles] = React.useState<any>(undefined)
    const [models, setModels] = React.useState<any>(undefined)
    const [images, setImages] = React.useState<any>(undefined)
    const [selectedStyle, setSelectedStyle] = React.useState<string>('')
    const [selectedImage, setSelectedImage] = React.useState<string>('')
    const [selectedModel, setSelectedModel] = React.useState<string>('v1-5-pruned-emaonly.ckpt [81761151]')
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    console.log({ prompt, selectedStyle, selectedImage, selectedModel })

    const getModels = async () => {
        const response = await axios.get("/api/stable-diffusion/models")
            .catch((err) => {
                console.log(err)
            })
        return response?.data
    }

    const getStyles = async () => {
        const response = await axios.get("/api/stable-diffusion/prompt-styles")
            .catch((err) => {
                console.log(err)
            })
        return response?.data
    }

    const checkStatus = async () => {
        const response = await axios.get("/api/stable-diffusion/check-status")
            .catch((err) => {
                console.log(err)
            })
        return response?.data
    }

    useQuery("models", getModels, {
        onSuccess: (data) => {
            setModels(data)
        }
    })

    useQuery("styles", getStyles, {
        onSuccess: (data) => {
            setStyles(data)
        }
    })

    const { data: status } = useQuery("status", checkStatus, {
        enabled: isLoading,
        refetchInterval: 1000,
    })

    const text2Image = async () => {
        if (!prompt || !selectedStyle || !selectedModel) return
        setImages(undefined)
        setSelectedImage('')
        setIsLoading(true)
        const response = await axios.post("/api/stable-diffusion/txt2img", {
            prompt,
            style: selectedStyle,
            model: selectedModel,
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setImages(response?.data.images)
        setIsLoading(false)
        return response
    }

    const image2Image = async () => {
        if (!models || !selectedStyle || !selectedImage) return
        setIsLoading(true)
        setImages(undefined)
        const response = await axios.post("/api/stable-diffusion/img2img", {
            prompt,
            style: selectedStyle,
            vary: true,
            image: selectedImage,
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setImages(response?.data.images)
        setSelectedImage('')
        setIsLoading(false)
        return response
    }

    return (
        <div className='min-h-screen p-10 space-y-10'>
            <div className='flex space-x-4 justify-center'>
                {models && <select className='p-2 font-pixel' onChange={(e) => setSelectedModel(e.target.value)}>
                    {models.map((model: any) => (
                        <option key={model.title} value={model.title}>{model.title}</option>
                    ))}
                </select>}
                {styles && <select className='p-2 font-pixel' onChange={(e) => setSelectedStyle(e.target.value)}>
                    {styles.map((style: any) => (
                        <option key={style.name} value={style.name}>{style.name}</option>
                    ))}
                </select>}
                <input onChange={(e) => setPrompt(e.target.value)}
                    className='p-2 bg-white font-pixel outline-none text-black' id='prompt' placeholder='Prompt' />
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
            {status ? <p className="font-pixel text-sm text-center">Wait time: {status?.eta_relative.toFixed(0)}s</p> : null}
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

export default TestPage