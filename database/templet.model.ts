import {model,models, Schema,Types } from "mongoose";

export interface IModel {

};

const accoutSchema = new Schema<IModel>({
  
},{
    timestamps:true,
}
)

// here also we need to check if the model is already defined then reuse it, if it not then create the model
const Account =models.Account || model<IModel >("Account",accoutSchema);

export default Account;