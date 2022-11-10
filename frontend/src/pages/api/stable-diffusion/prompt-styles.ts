import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { baseUrl } from '../../../utils/constants'
import nc from "next-connect";
import cors from "cors";

const handler = nc()
    .use(cors())
    .get(async (_: NextApiRequest, res: NextApiResponse) => {
        axios.get(`${baseUrl}/sdapi/v1/prompt-styles`, {
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