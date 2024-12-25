export type APIRoutes = {
    "/foo/": {

    },
    "/createCategory": {
        name: string,

    },
    "/getCategories": {
        categories: {
            id: number,
            name: string,

        }[],

    },
    "/createPost": {
        id: number,
        title: string,
        content: string,
        categoryId: number,

    },
    "/getPosts": {
        posts: {
            id: number,
            title: string,
            content: string,
            categoryId: number,

        }[],

    },

}