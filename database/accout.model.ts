import {model,models, Schema,Types } from "mongoose";

export interface IAccount {
    userId: Types.ObjectId;
    name: string;
    image?: string;
    password? : string;
    provider: string; // google,facebook,twitter,github --> we can use enum here but we need to use string
    providerAccountId: string;
};

const accoutSchema = new Schema<IAccount>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    password:{
        type:String,
       
    },
    provider:{
        type:String,
        required:true,
        // enum:["google","facebook","twitter","github"], 
    },
    providerAccountId:{
        type:String,
        required:true,
    }
    

},{
    timestamps:true,
}
)

// here also we need to check if the model is already defined then reuse it, if it not then create the model
const Account =models.Account || model<IAccount>("Account",accoutSchema);

export default Account;