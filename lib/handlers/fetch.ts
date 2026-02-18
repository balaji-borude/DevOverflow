// RequesetInit is dictionary of the FetchApi represent the set of the options that can be used toe hte configure a fetch request

// import { ActionResponse } from "@/types/global";

import { RequestError } from "../http-errors";
import Logger from "../logger";
import handleError from "./errors";
import { ActionResponse } from "@/types/global";

interface FetchOptions extends RequestInit {
  timeout?: number;
};

// helper fuuction for the error 
function isError(error:unknown):error is Error{
    return error instanceof Error;
};


export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {

  const { 
        timeout = 5000, 
        headers:customHeaders={},
        ...restOptions 
    } = options;

    // abort controller is used to cancel the request --> this abort controller built on DOm 
    const controller = new AbortController();

    // START THE TIMER HERE 
    const id = setTimeout(()=>controller.abort(), timeout);

    const defaultHeaders = {
        "Content-Type": "application/json",
        "accept": "application/json",
    };

    const headers : HeadersInit = {
        ...defaultHeaders,
        ...customHeaders,
    };

    const config: RequestInit = {
        ...restOptions,
        headers,
        signal: controller.signal, // this signal support the request cancellation 
    };

    // make the request
    try {
        
        const response = await fetch(url, config);
        clearTimeout(id); // if the request is cancelled or completed  then clear the timer

        if (!response.ok) {
            throw new RequestError(response.status,`HTTP error: ${response.status}`);
         
        };

        return await response.json();


        //const data = await response.json();

        // return {
        //     success: true,
        //     data,
        //     status: response.status,
        // };


    } catch (err) {
        const error = isError(err) ? err: new Error("Unknown error");   
        
        if(error.name === "AbortError"){
            Logger.warn(`Request to ${url} was Timed out`);
        }else{
            Logger.error(`Request to ${url} failed with error ${error.message}`);
        }
        return handleError(error) as ActionResponse<T>;
    }   

};

