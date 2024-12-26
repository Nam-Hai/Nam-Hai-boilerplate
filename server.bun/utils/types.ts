export type APIRoutes = {
  "/api/foo/": {
    query: {};
    payload: {};
  };
  "/api/createCategory": {
    query: {
      name: string;
    };
    payload: {
      id: string;
      name: string;
      date: Date;
    };
  };
  "/api/deleteCategory": {
    query: {
      id: string;
    };
    payload: {
      id: string;
      name: string;
      date: Date;
    };
  };
  "/api/getCategories": {
    query: {};
    payload: {
      categories: {
        id: string;
        name: string;
        date: Date;
      }[];
    };
  };
  "/api/createPost": {
    query: {
      id: string;
      title: string;
      content: string;
      categoryId: string;
    };
    payload: {
      id: string;
      title: string;
      content: string;
      categoryId: string;
    };
  };
  "/api/getPosts": {
    query: {
      categoryId: string;
    };
    payload: {
      posts: {
        id: string;
        title: string;
        content: string;
        categoryId: string;
      }[];
    };
  };
  "/api/test": {
    query: {};
    payload: string[];
  };
};
