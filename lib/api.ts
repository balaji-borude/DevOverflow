// fetch handler 
// here calling all the api request here

import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL = "process.env.API_BASE_URL || 'http://localhost:3000/api'";


export const api = {
    users:{
        getAll:()=>fetchHandler(`${API_BASE_URL}/users`),
    },
    
    getById:(id:string)=>fetchHandler(`${API_BASE_URL}/users/${id}`),

    getByEmail:(email:string)=>fetchHandler(`${API_BASE_URL}/users/email/`,{
        method:"POST",
        body:JSON.stringify({email}),
    }),

}