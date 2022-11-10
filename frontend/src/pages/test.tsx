import React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'

function TestPage() {

    const prompt = "a pangolin"
    const [styles, setStyles] = React.useState<any>(undefined)
    const [models, setModels] = React.useState<any>(undefined)
    const [images, setImages] = React.useState<any>(undefined)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const getModels = async () => {
        const response = await axios.get("/api/stable-diffusion/models")
            .catch((err) => {
                console.log(err)
            })
        return response
    }

    const getStyles = async () => {
        const response = await axios.get("/api/stable-diffusion/prompt-styles")
            .catch((err) => {
                console.log(err)
            })
        return response
    }

    const checkStatus = async () => {
        const response = await axios.get("/api/stable-diffusion/check-status")
            .catch((err) => {
                console.log(err)
            })
        return response
    }

    useQuery("models", getModels, {
        onSuccess: (data) => {
            setModels(data?.data)
        }
    })

    useQuery("styles", getStyles, {
        onSuccess: (data) => {
            setStyles(data?.data)
        }
    })

    const { data: status } = useQuery("status", checkStatus, {
        enabled: isLoading,
        refetchInterval: 1000,
    })

    const text2Image = async () => {
        if (!models || !styles) return
        setIsLoading(true)
        const response = await axios.post("/api/stable-diffusion/txt2img", {
            prompt,
            style: styles[2].name,
            model: models[0].title,
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setImages(response?.data.images)
        setIsLoading(false)
        return response
    }

    const image2Image = async () => {
        if (!models || !styles || !images) return
        setIsLoading(true)
        const response = await axios.post("/api/stable-diffusion/img2img", {
            prompt,
            style: styles[2].name,
            vary: true,
            image: images[0],
        }).catch((err) => {
            console.log(err)
        })
        console.log(response)
        setImages(response?.data.images)
        setIsLoading(false)
        return response
    }

    return (
        <div className='min-h-screen'>
            <div className='flex space-x-5 justify-center mt-5 items-center'>
                <button className='p-2 font-pixel text-white bg-acid' onClick={getModels}>
                    Models
                </button>
                <button className='p-2 font-pixel text-white bg-acid' onClick={getStyles}>
                    Styles
                </button>
                <button className='p-2 font-pixel text-white bg-acid' onClick={text2Image}>
                    Txt2Img
                </button>
                <button className='p-2 font-pixel text-white bg-acid' onClick={image2Image}>
                    Img2Img
                </button>
            </div>
            {status ? <p className="p-4 font-pixel text-sm">Wait time: {status?.data.eta_relative.toFixed(0)}s</p> : null}
            <div className='grid p-4 grid-cols-4 gap-4 mt-6'>
                {images && images.map((image: any, index: number) => {
                    return (
                        <img key={index} src={`data:image/.webp;base64,${image}`} />
                    )
                })}
            </div>
        </div>
    )
}

export default TestPage