// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if(req.method === 'POST')
    {
        const session = await getServerSession(req, res, authOptions)
        if(!session) return res.status(401).json({ message: "Please sign in to make a post" })

        const title: string = req.body.title

        // Get user
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email}
        })

        //Check title
        if(title.length > 300) return res.status(403).json({message: "Please write shorter post."})
        if(!title.length) return res.status(403).json({message: "Please do leave this empty."})

        // Create post
        try{
            const result = await prisma.post.create({
                data: {
                    title,
                    userId: prismaUser.id
                }
            })
            res.status(200).json(result)
        }catch (err){
            res.status(403).json({err: 'Error has occured while making a post.'})
        }
    }
}
