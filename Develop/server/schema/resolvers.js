// const variables: Auth, User Models, Apollo
const { AuthenticationError } = require('apollo-server-express');
const { Game, User } = require('../models');
const { signToken } = require('../utils/auth');

// resolver const 
const resolvers = {

    // -- Query find with gameid, user , genre ,  
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
                return user
            };
        },

    },
    // Mutation to addUser, login, addtoCart, and removefromCart
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        SaveBook: async (parent, { body }, context) => {
            console.log(context);
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { cart: body } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('Not logged in');
        },
        removeFromCart: async (parent, { gameId }, context) => {
            console.log(context);
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { cart: { gameId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('Not logged in');
        },



        // Send game element to checkout and populate checkout
    }
};
// export module
module.exports = resolvers;