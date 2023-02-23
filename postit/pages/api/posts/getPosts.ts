// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client'
import * as console from "console";

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if(req.method === 'GET')
    {
        // Fetch all posts
        try{
            const data = await prisma.post.findMany({
                include: {
                    user: true,
                    comments: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            res.status(200).json(data)
            console.log(data)
        }
        catch (err){
            res.status(403).json({err: 'Error fetching posts.'})
        }
    }
}
