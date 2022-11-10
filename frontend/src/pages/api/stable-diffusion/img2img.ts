import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { baseUrl } from '../../../utils/constants'
import nc from "next-connect";
import cors from "cors";

const body = {
    init_images: [""],
    denoising_strength: 0.75,
    mask_blur: 4,
    inpainting_fill: 0,
    inpaint_full_res: true,
    prompt: "",
    styles: [""],
    seed: -1,
    subseed: -1,
    subseed_strength: -1,
    batch_size: 8,
    n_iter: 1,
    steps: 50,
    cfg_scale: 10,
    restore_faces: false,
    negative_prompt: "",
    override_settings: {},
    sampler_index: "Euler a",
}

const handler = nc()
    .use(cors())
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        const { prompt, style, image, vary } = req.body
        if (vary) {
            body.subseed = 1
            body.subseed_strength = 1
        }
        body.prompt = prompt as string
        body.styles = [style as string]
        body.init_images = [";," + image as string]
        // console.log({ ...body })
        axios.post(`${baseUrl}/sdapi/v1/img2img`, {
            timeout: 1000 * 60 * 10,
            ...body,
            headers: { 'accept': 'application/json' }
        }).then((response) => {
            res.status(200).json(response.data)
        }).catch((error) => {
            if (axios.isAxiosError(error)) {
                res.status(500).json(error.message)
            } else {
                res.status(500).json({ message: 'An unexpected error occurred' })
            }
        })
    })

export default handler