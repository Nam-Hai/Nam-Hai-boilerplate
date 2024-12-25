export type APIRoutes = {
            "/api/foo/": {
            query: {
    
}
            payload: {
    
},
        },
"/api/createCategory": {
            query: {
    name: string,

}
            payload: {
    id: number,
name: string,

},
        },
"/api/deleteCategory": {
            query: {
    id: number,

}
            payload: {
    id: number,
name: string,

},
        },
"/api/getCategories": {
            query: {
    
}
            payload: {
    categories: {
    id: number,
name: string,

}[],

},
        },
"/api/createPost": {
            query: {
    id: number,
title: string,
content: string,
categoryId: number,

}
            payload: {
    id: number,
title: string,
content: string,
categoryId: number,

},
        },
"/api/getPosts": {
            query: {
    categoryId: number,

}
            payload: {
    posts: {
    id: number,
title: string,
content: string,
categoryId: number,

}[],

},
        },

}