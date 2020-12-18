export default {
  optimizeDeps: {
    include: [
      "@apollo/client/core",
      "@apollo/client/cache",
      "@apollo/client/link/ws",
      "@apollo/client/link/context",
      "@apollo/client/utilities",
      ,
      "graphql/language/visitor",
    ],
  },
  rollupInputOptions: {
    // ignore react stuff
    external: ["react"],
  },
};
