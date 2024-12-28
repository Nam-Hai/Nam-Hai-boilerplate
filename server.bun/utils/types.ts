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
      map: Map<string, { foo: boolean }>;
      set: Set<{ name: string; foo: boolean }>;
      num: number;
      tup: [string, number];
      prom: Promise<string>;
      promObj: Promise<{ name: string }>;
      obj: Record<string, { name: string }>;
      str?: string | null;
      choco?: {
        test: boolean | (number | null)[] | (number | null);
        yo: null;
        lit: "test";
        tup?:
          | ([string, number, { cho: number[] | null } | null] | null)[]
          | null;
      }[];
    };
    payload: number;
  };
};
