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
    if(req.method === 'GET')
    {
        const session = await getServerSession(req, res, authOptions)
        if(!session) return res.status(401).json({ message: "Please sign in!" })

        // Get user
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email}
        })


        // Get auth users posts
        try{
           const data = await prisma.user.findUnique(
               {
                   where: {email: session?.user?.email},
                   include: {
                       posts:{
                           orderBy: {
                               createdAt: 'desc'
                           },
                           include: {
                               comments: true
                           }
                       }
                   }
               })
            res.status(200).json(data)
        }catch (err){
            res.status(403).json({err: 'Error has occured while making a post.'})
        }
    }
}
