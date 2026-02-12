import tickets from "@/app/database";
import { NextResponse } from "next/server";

// get requeset 
export async function GET(){
    return NextResponse.json(tickets);
}
//Post
export async function POST(req:Request){

    // this is Descrsturring method 
    const {name,status,type} = await req.json();

    // another method is 
    const body = await req.body;
    console.log("body",body);
};

