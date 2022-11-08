import axios from 'axios'
import { Experiment, Generation, Option, Status } from '../../typings';
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