import {model,models, Schema,Types } from "mongoose";

export interface ICollection {
    author: Types.ObjectId; // refereance to the users model 
    question: Types.ObjectId; // refereance to the question model 
};

const CollectionSchema = new Schema<ICollection>({
  author:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
question:{
    type:Schema.Types.ObjectId,
    ref:"Question",
    required:true
  },



},{
    timestamps:true,
}
)

// here also we need to check if the model is already defined then reuse it, if it not then create the model
const Collection =models?.Collection || model<ICollection >("Collection",CollectionSchema);

export default Collection;