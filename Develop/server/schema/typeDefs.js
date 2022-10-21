const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int
}

type Book {
    bookId: ID!
    image: String
    title: String!
    author: String
    description: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User(id:INT!)
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(author:String!, description:String!, title:String!, bookId:ID!, image:String!, link: String! )
    login(email: String!, password: String!): Auth
    removeFromCart(bookId: ID!): User
}
`

module.exports=typeDefs