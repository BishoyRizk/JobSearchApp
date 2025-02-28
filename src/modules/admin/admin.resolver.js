import { GraphQLNonNull, GraphQLString } from 'graphql'
import {getAllUsersAndCompanies} from './admin.query.js'
import {authenticationGraphQl,authorizationGraphQl} from '../../middleware/auth.middleware.js'
import { roleTypes, userModel } from '../../DB/model/User.model.js'
import * as dbService from '../../DB/dbService.js'
import { companyModel } from '../../DB/model/company.model.js'


export const getAll ={
    type:getAllUsersAndCompanies,
    args:{
        authorization:{type: new GraphQLNonNull(GraphQLString)}
    },
    resolve:async(parent,args)=>{
        const {authorization}=args

        const user = await authenticationGraphQl({authorization})

         authorizationGraphQl({accessRoles:[roleTypes.admin],role:user.role})

         const [usersResult, companiesResult] = await Promise.allSettled([
            dbService.findAll({ model: userModel }),
            dbService.findAll({ model: companyModel })
        ]);

        const users = usersResult.status === 'fulfilled' ? usersResult.value : [];
        const companies = companiesResult.status === 'fulfilled' ? companiesResult.value : [];

        const data = [...users, ...companies];

        return { message: 'Done', statusCode: 200, data: data };

        
    }
}