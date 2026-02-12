import { NextResponse } from "next/server";
import tickets from "@/app/database";
//get by Id  // path app/api/tickets/[id]/route.ts
//  --> by implementing the dynamic route handeler 
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){

    const {id} = await params;
    return NextResponse.json(tickets.find(ticket=>ticket._id===id));
}