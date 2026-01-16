import qs from 'query-string';
import { string } from 'zod';

interface UrlQueryParams {
    params:string,
    key:string,
    value:string
};

interface RemoveUrlQueryParams {
    params:string,
    keysToRemove:string[]
};

export const formUrlQuery = ({params,key, value}:UrlQueryParams)=>{

    const queryString = qs.parse(params);

    queryString[key] = value;
    return qs.stringifyUrl({
        url:window.location.pathname,
        query:queryString
    });
 

};
export const removeKeyFromQuery = ({params,keysToRemove}:RemoveUrlQueryParams)=>{

    const queryString = qs.parse(params);

    keysToRemove.forEach(element => {
        delete queryString[element]
    });


    return qs.stringifyUrl({
        url:window.location.pathname,
        query:queryString
    },{
        skipNull:true
    });
 

};

