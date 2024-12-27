export type APIRoutes = {
  "/api/foo/": {
    query: {};
    payload: {};
  };
  "/api/createCategory": {
    query: { name: string };
    payload: { id: number; name: string; date: Date };
  };
  "/api/deleteCategory": {
    query: { id: number };
    payload: { id: number; name: string; date: Date };
  };
  "/api/getCategories": {
    query: {};
    payload: { categories: { id: number; name: string; date: Date }[] };
  };
  "/api/createPost": {
    query: { id: number; title: string; content: string; categoryId: number };
    payload: { id: number; title: string; content: string; categoryId: number };
  };
  "/api/getPosts": {
    query: { categoryId: number };
    payload: {
      posts: {
        id: number;
        title: string;
        content: string;
        categoryId: number;
      }[];
    };
  };
  "/api/test": {
    query: {
      obj: { foo: number; bar: boolean };
      choco?: {
        test: boolean | (number | null)[] | (number | null);
        yo: null;
        lit: "test";
        tup?: ([string, number, { cho: number[] } | null] | null)[] | null;
      }[];
    };
    payload: number;
  };
};
