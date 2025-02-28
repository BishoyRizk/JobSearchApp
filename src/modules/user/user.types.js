import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { genderTypes, providerTypes, roleTypes } from "../../DB/model/User.model.js";



export const userTypes = new GraphQLObjectType({
    name:'userTypes',
    fields:{
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        phone:{type:GraphQLString},
        DOB:{type:GraphQLString},
        gender:{type: new GraphQLEnumType({
            name:'gender',
            values:{
                male:{value:genderTypes.male},
                female:{value:genderTypes.female},
            }
        })},
        provider:{type: new GraphQLEnumType({
            name:'provider',
            values:{
                system:{value:providerTypes.system},
                google:{value:providerTypes.google},
            }
        })},
        role:{type: new GraphQLEnumType({
            name:'role',
            values:{
                admin:{value:roleTypes.admin},
                user:{value:roleTypes.user},
            }
        })},
        isConfirmed:{type:GraphQLBoolean},
        updatedBy:{type:GraphQLID},
        isDeleted:{type:GraphQLString},
        isBanned:{type:GraphQLString},
        changeCredentialTime:{type:GraphQLString},
        profilePic: {
            type: new GraphQLObjectType({
                name: 'ProfilePic',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },
        coverPic: {
            type: new GraphQLObjectType({
                name: 'CoverPic',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },
        OTP: {
            type: new GraphQLList(new GraphQLObjectType({
                name: 'OTP',
                fields: {
                    code: { type: GraphQLString },
                    type: {
                        type: new GraphQLEnumType({
                            name: 'OTPType',
                            values: {
                                confirmEmail: { value: 'confirmEmail' },
                                forgetPassword: { value: 'forgetPassword' },
                                resetPassword: { value: 'resetPassword' }
                            }
                        })
                    },
                    expiresIn: { type: GraphQLString }
                }
            }))
        },

    }
})