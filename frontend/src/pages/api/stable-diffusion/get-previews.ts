import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { baseUrl } from '../../../utils/constants'
import nc from "next-connect";
import cors from "cors";

const handler = nc()
    .use(cors())
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const style = req.query.style as string
        const vialType = style.includes('collection') ? 'collection' : 'concept'
        console.log(`${baseUrl}/file=vial_images/${vialType}s/${style}.png`)
        axios.get(`${baseUrl}/file=vial_images/${vialType}s/${style}.png`, {
            headers: { 'accept': 'application/json' },
            responseType: 'arraybuffer'
        }).then((response) => {
            // convert arraybuffer to base64
            const base64 = Buffer.from(response.data, 'binary').toString('base64')
            res.status(200).json({ base64 })
        }).catch((error) => {
            if (axios.isAxiosError(error)) {
                res.status(500).json(error.message)
            } else {
                res.status(500).json({ message: 'An unexpected error occurred' })
            }
        })
    })

export default handler