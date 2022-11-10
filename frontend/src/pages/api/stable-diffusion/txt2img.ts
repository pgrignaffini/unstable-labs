import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { baseUrl } from '../../../utils/constants'
import nc from "next-connect";
import cors from "cors";

const body = {
    enable_hr: false,
    prompt: "",
    negative_prompt: "",
    styles: [""],
    seed: -1,
    batch_size: 8,
    n_iter: 1,
    steps: 50,
    cfg_scale: 10,
    restore_faces: false,
    override_settings: { sd_model_checkpoint: "" },
    sampler_index: "Euler a"
}

const handler = nc()
    .use(cors())
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        const { prompt, style, model } = req.body
        body.prompt = prompt as string
        body.styles = [style as string]
        body.override_settings.sd_model_checkpoint = model as string
        // console.log({ ...body })
        axios.post(`${baseUrl}/sdapi/v1/txt2img`, {
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