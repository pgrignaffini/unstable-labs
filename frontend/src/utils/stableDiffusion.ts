import axios from 'axios'
import { Experiment, Generation, Option, Status, Progress, Request } from '../../typings';
import { options } from './options';

export const generateImages = async (prompt: string, selectedOption: Option): Promise<string> => {
    console.log("Generating image with prompt: ", prompt)
    const response = await axios.post('https://stablehorde.net/api/v2/generate/async', {
        prompt: prompt,
        params: selectedOption?.params,
    }, {
        headers: {
            'apikey': process.env.NEXT_PUBLIC_STABLE_HORDE_API_KEY
        }
    }).catch(function (error) {
        console.log(error);
    });
    return response?.data?.id
}

export const remixImage = async (selectedExperiment: Experiment, selectedImage: string): Promise<string> => {
    const option = options.find(option => option.type === selectedExperiment?.generatedByType)
    const response = await axios.post('https://stablehorde.net/api/v2/generate/async', {
        prompt: selectedExperiment?.prompt,
        params: option?.params,
        source_image: selectedImage,
    }, {
        headers: {
            'apikey': process.env.NEXT_PUBLIC_STABLE_HORDE_API_KEY
        }
    }).catch(function (error) {
        console.log(error)
    });

    return response?.data?.id
}

export const checkStatus = async (requestID: string | undefined): Promise<Status | undefined> => {
    if (!requestID) return undefined
    const response = await axios.get(`https://stablehorde.net/api/v2/generate/check/${requestID}`, {
    }).catch(function (error) {
        console.log(error);
    });

    return response?.data
}

export const retrieveImages = async (requestID: string | undefined): Promise<Generation[] | undefined> => {
    if (!requestID) return undefined
    const response = await axios.get(`https://stablehorde.net/api/v2/generate/status/${requestID}`, {
    }).catch(function (error) {
        console.log(error);
    });
    return response?.data?.generations
}

// Custom API

export const text2Image = async (prompt: string, selectedStyle: string) => {
    const response = await axios.post("/api/stable-diffusion/txt2img", {
        prompt,
        style: selectedStyle,
    }).catch((err) => {
        console.log(err)
    })
    return response?.data
}

export const image2Image = async (prompt: string, selectedStyle: string, selectedImage: string) => {
    const response = await axios.post("/api/stable-diffusion/img2img", {
        prompt,
        style: selectedStyle,
        image: selectedImage,
    }).catch((err) => {
        console.log(err)
    })
    console.log(response)
    return response?.data
}

export const checkProgress = async (req: Request) => {
    const response = await axios.get("/api/stable-diffusion/check-progress")
        .catch((err) => {
            console.log(err)
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

export const getImages = async (req: Request) => {
    const response = await axios.get("/api/stable-diffusion/get-images", {
        params: { job_hash: req?.job_hash },
    }).catch((err) => {
        console.log(err)
    })
    const images = response?.data.split("\n")
    return images
}