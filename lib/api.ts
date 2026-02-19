// centralized API handler for all API calls in the application

import { IAccount } from "@/database/accout.model";
import { fetchHandler } from "./handlers/fetch";
import { IUser } from "@/database/user.model";

// Base URL for the API
const API_BASE_URL = "process.env.API_BASE_URL || 'http://localhost:3000/api'";


export const api = {
    //ALL User Related API calls
    users:{
        getAll:()=>fetchHandler(`${API_BASE_URL}/users`),
        // get user by id
        getById:(id:string)=>fetchHandler(`${API_BASE_URL}/users/${id}`),
    
        // get user by email    
        getByEmail:(email:string)=>fetchHandler(`${API_BASE_URL}/users/email/`,{
            method:"POST",
            body:JSON.stringify({email}),
        }),

        create:(userData:Partial<IUser>)=>fetchHandler(`${API_BASE_URL}/users`,{
            method:"POST",
            body:JSON.stringify(userData),
        }),
        update:(id:string,userData:Partial<IUser>)=> fetchHandler(`${API_BASE_URL}/users/${id}`,{
            method:"PUT",
            body:JSON.stringify(userData),
        }),
        delete:(id:string)=>fetchHandler(`${API_BASE_URL}/users/${id}`,{
            method:"DELETE",
            body:JSON.stringify({id}),
        }),

    },  
    
    //ALl Account Related API calls
      accounts:{
        getAll:()=>fetchHandler(`${API_BASE_URL}/accounts`),
        // get user by id
        getById:(id:string)=>fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    
        // get user by email/provider (github or google)    
        getByProvider:(providerAccountId:string)=>fetchHandler(`${API_BASE_URL}/accounts/provider`,{
            method:"POST",
            body:JSON.stringify({providerAccountId}),
        }),

        // CRUD Operations
        create:(accountData:Partial<IAccount>)=>fetchHandler(`${API_BASE_URL}/accounts`,{
            method:"POST",
            body:JSON.stringify(accountData),
        }),
        update:(id:string,accountData:Partial<IAccount>)=> fetchHandler(`${API_BASE_URL}/accounts/${id}`,{
            method:"PUT",
            body:JSON.stringify(accountData),
        }),
        delete:(id:string)=>fetchHandler(`${API_BASE_URL}/accounts/${id}`,{
            method:"DELETE",
            body:JSON.stringify({id}),
        }),

    },
    
}