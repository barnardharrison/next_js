export type AuthPosts = {
    email: string
    id: string
    name: string
    image: string
    posts: {
        createdAt: string
        id: string
        title: string
        comments?: {
            createdAt: string
            id: string
            postId: string
            userId: string
            title: string
        }[]
    }[]
}