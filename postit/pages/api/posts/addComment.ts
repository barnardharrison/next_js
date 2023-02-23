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
        if(!session) return res.status(401).json({ message: "Please sign in!" })

        const prismaUser = await prisma.user.findUnique({
            where: {
                email: session?.user?.email
            }
        })

        try{
            const {title, postId} = req.body.data
           if(!title.length)
           {
               return res.status(401).json("Please enter a comment")
           }
           console.log(title)
            console.log(prismaUser)
            console.log(postId)
           const result = await prisma.Comment.create({
               data: {
                   message: title,
                   userId: prismaUser?.id,
                   postId
               }
           })
            res.status(200).json(result)
        }catch (err){
            res.status(403).json({err: 'Error has occured while adding a comment.'})
        }
    }
}
