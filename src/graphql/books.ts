import gql from 'graphql-tag'

export const allBooks = gql`
    query AllBooks {
        books {
            id
            title
            isbn
            pages
        }
    }
`

export const bookByPk = gql`
    query bookByPx($id: bigint!) {
        books_by_pk(id: $id) {
            classification
            cover_image
            id
            isbn
            language
            pages
            title
            year
        }
    }
`

export const allBookISBN = gql`
    query AllBooks {
        books {
            isbn
        }
    }
`

export const addBookMutation = gql`
    mutation addBook($object: books_insert_input!) {
        insert_books_one(object: $object) {
            id
            title
            isbn
            pages
        }
    }
`

export const getBookDataMutation = gql`
    mutation getBookData($isbn: String!) {
        getBookData(isbn: $isbn) {
            classification
            isbn
            language
            pages
            title
            year
        }
    }
`
