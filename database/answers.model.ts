import {model,models, Schema,Types } from "mongoose";

export interface IAnswer {
    author: Types.ObjectId; // refereance to the uses 
    question: Types.ObjectId; // refereance to the user 
    content: string;
    upvotes: number;    
    downvotes: number;
};
// one question has many answers (one to many relationship )
// but one answer can only have one question (one to one relationship)  


// Answers Schema
const AnswerSchema = new Schema<IAnswer>({
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
  content:{
    type:String,
    required:true
  },
  upvotes:{
    type:Number,
    default:0
  },
  downvotes:{
    type:Number,
    default:0
  },

},{
    timestamps:true,
}
)

// here also we need to check if the model is already defined then reuse it, if it not then create the model
const Answer =models.Account || model<IAnswer >("Account",AnswerSchema);

export default Answer;   