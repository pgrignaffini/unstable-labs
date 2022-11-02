import React from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'


type Generation = {
    img: string,
    model: string,
    seed: string,
    worker_id: string,
    worker_name: string,
}

type Params = {
    sampler_name: string,
    cfg_scale: number,
    steps: number,
    n: number,
}

type Status = {
    done: boolean,
    faulted: boolean,
    finished: number,
    processing: number,
    queue_position: number,
    wait_time: number,
    waiting: number,
}

type Option = {
    value: string,
    label: string,
    prompt: string,
    params: Params
}


function TestPage() {

    const [requestID, setRequestID] = React.useState<string | null>(null)
    const [generatedImages, setGeneratedImages] = React.useState<Generation[]>([])
    const [status, setStatus] = React.useState<Status | null>(null)

    const prompt3DCharacter = "tiny cute dragon toy, standing character, soft smooth lighting, soft pastel colors, skottie young, 3d blender render, polycount, modular constructivism, pop surrealism, physically based rendering, square image"
    const params3DCharacter = {
        sampler_name: "DDIM",
        cfg_scale: 13,
        steps: 25,
        n: 8,
    }

    const promptComicArt = "Retro comic style artwork, highly detailed Steve Jobs eating an apple, comic book cover, symmetrical, vibrant"
    const paramsComicArt = {
        sampler_name: "DDIM",
        cfg_scale: 13,
        steps: 25,
        n: 8,
    }

    const promptRealisticAnime = "Closeup face portrait of a black girl wearing crown of flowers, smooth soft skin, big dreamy eyes, beautiful intricate colored hair, symmetrical, anime wide eyes, soft lighting, detailed face, by makoto shinkai, stanley artgerm lau, wlop, rossdraws, concept art, digital painting, looking into camera"
    const paramRealisticAnime = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptCuteCreature = "3d fluffy cat, closeup cute and adorable, cute big circular reflective eyes, long fuzzy fur, Pixar render, unreal engine cinematic smooth, intricate detail, cinematic"
    const paramCuteCreature = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptLowPolyCreature = "kawaii low poly panda character, 3d isometric render, white background, ambient occlusion, unity engine"
    const paramLowPolyCreature = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptRenderedObject = "Tiny cute isometric rocket, soft smooth lighting, with soft colors, 100mm lens, 3d blender render, trending on polycount, modular constructivism, blue background, physically based rendering, centered"
    const paramRenderedObject = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptIsometricRooms = "Tiny cute isometric living room in a cutaway box, soft smooth lighting, soft colors, purple and blue color scheme, soft colors, 100mm lens, 3d blender render"
    const paramIsometricRooms = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptBlockStructures = "Tiny cute isometric temple, soft smooth lighting, soft colors, soft colors, 100mm lens, 3d blender render, trending on polycount, modular constructivism, blue blackground, physically based rendering, centered"
    const paramBlockStructures = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptFunkyPop = "Funko pop Yoda figurine, made of plastic, product studio shot, on a white background, diffused lighting, centered"
    const paramFunkyPop = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptSportTeamLogo = "2d ferocious lion head, vector illustration, angry eyes, football team emblem logo, 2d flat, centered"
    const paramSportTeamLogo = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptGoldPendant = "gold dia de los muertos pendant, intricate 2d vector geometric, cutout shape pendant, blueprint frame lines sharp edges, svg vector style, product studio shoot"
    const paramGoldPendant = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptSurrealMicroWorld = "100mm photo of isometric floating island in the sky, surreal volcano, intricate, high detail, behance, microworlds smooth, macro sharp focus, centered"
    const paramSurrealMicroWorld = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptCuteSticker = "Die-cut sticker, Cute kawaii flower character sticker, white background, illustration minimalism, vector, pastel colors"
    const paramCuteSticker = {
        sampler_name: "k_euler_a",
        cfg_scale: 13,
        steps: 50,
        n: 8,
    }

    const promptSpaceHologram = "hologram of a wolf floating in space, a vibrant digital illustration, dribbble, quantum wavetracing, black background, behance hd"
    const paramSpaceHologram = {
        sampler_name: "DDIM",
        cfg_scale: 13,
        steps: 25,
        n: 8,
    }

    const promptPsychedelicPopArt = "Hypnotic illustration of a Halloween pumpkin, hypnotic psychedelic art by Dan Mumford, pop surrealism, dark glow neon paint, mystical, Behance"
    const paramPsychedelicPopArt = {
        sampler_name: "DDIM",
        cfg_scale: 13,
        steps: 25,
        n: 8,
    }

    const promptSilhoutteWallpaper = "Multiple layers of silhouette mountains, with silhouette of big rocket in sky, sharp edges, at sunset, with heavy fog in air, vector style, horizon silhouette Landscape wallpaper by Alena Aenami, firewatch game style, vector style background"
    const paramSilhoutteWallpaper = {
        sampler_name: "DDIM",
        cfg_scale: 13,
        steps: 25,
        n: 8,
    }

    const generate = async () => {
        setGeneratedImages([])
        setRequestID(null)
        setStatus(null)
        axios.post('https://stablehorde.net/api/v2/generate/async', {
            prompt: selected?.prompt,
            params: selected?.params,
        }, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_STABLE_HORDE_API_KEY
            }
        }).then(function (response) {
            console.log(response);
            setRequestID(response.data.id)
        }).catch(function (error) {
            console.log(error);
        });
    }

    const checkStatus = async () => {
        axios.get(`https://stablehorde.net/api/v2/generate/check/${requestID}`, {
        }).then(function (response) {
            console.log(response.data);
            setStatus(response.data)
        }).catch(function (error) {
            console.log(error);
        });
    }

    useQuery('checkStatus', checkStatus, {
        enabled: requestID !== null,
        refetchInterval: requestID !== null ? 1000 : false
    })

    const retrieveImages = async () => {
        axios.get(`https://stablehorde.net/api/v2/generate/status/${requestID}`, {
        }).then(function (response) {
            console.log(response);
            setGeneratedImages(response.data.generations)
            setRequestID(null)
            setStatus(null)
        }).catch(function (error) {
            console.log(error);
        });
    }

    useQuery('retrieveImages', retrieveImages, {
        enabled: status?.done,
    })

    const options: Option[] = [
        { value: 'renderedObject', label: 'Rendered Object', prompt: promptRenderedObject, params: paramRenderedObject },
        { value: 'isometricRooms', label: 'Isometric Rooms', prompt: promptIsometricRooms, params: paramIsometricRooms },
        { value: 'blockStructures', label: 'Block Structures', prompt: promptBlockStructures, params: paramBlockStructures },
        { value: 'funkyPop', label: 'Funky Pop', prompt: promptFunkyPop, params: paramFunkyPop },
        { value: 'sportTeamLogo', label: 'Sport Team Logo', prompt: promptSportTeamLogo, params: paramSportTeamLogo },
        { value: 'goldPendant', label: 'Gold Pendant', prompt: promptGoldPendant, params: paramGoldPendant },
        { value: 'surrealMicroWorld', label: 'Surreal Micro World', prompt: promptSurrealMicroWorld, params: paramSurrealMicroWorld },
        { value: 'cuteSticker', label: 'Cute Sticker', prompt: promptCuteSticker, params: paramCuteSticker },
        { value: 'spaceHologram', label: 'Space Hologram', prompt: promptSpaceHologram, params: paramSpaceHologram },
        { value: 'psychedelicPopArt', label: 'Psychedelic Pop Art', prompt: promptPsychedelicPopArt, params: paramPsychedelicPopArt },
        { value: 'silhoutteWallpaper', label: 'Silhoutte Wallpaper', prompt: promptSilhoutteWallpaper, params: paramSilhoutteWallpaper },
    ]

    const [selected, setSelected] = React.useState<Option | undefined>(options[0])

    React.useEffect(() => {
        console.log(selected)
    }, [selected])

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className='flex flex-col justify-center space-y-10'>
                <div className='flex flex-col justify-center space-y-2'>
                    <label className='text-xl font-bold'>Select Prompt</label>
                    <select onChange={(e) => setSelected(JSON.parse(e.target.value))} className='border-2 border-gray-300 rounded-md p-2'>
                        {options.map(option => (
                            <option key={option.value} value={JSON.stringify(option)}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button className='bg-acid text-white p-2 rounded-md' onClick={generate}>Generate</button>
                {status &&
                    <div className='flex space-x-4'>
                        <p>Wait time: {status.wait_time}</p>
                        <p>{`${status && status.processing <= 0 ? "Queuing the request" : "Queued"}`}</p>
                        {status && status.processing > 0 && <p>{`Processing: ${status.processing} images`}</p>}
                        {status && status.finished > 0 && <p>{`Finished rendering: ${status.finished} images`}</p>}
                    </div>
                }
                {
                    generatedImages.map((generation, index) => {
                        return (
                            <div className='flex flex-col space-y-2' key={index}>
                                <img src={"data:image/.webp;base64," + generation.img} alt="image" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TestPage