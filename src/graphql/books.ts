import gql from "graphql-tag";

export const allBooks = gql`
  query AllBooks {
    books {
      id
      title
    }
  }
`;
