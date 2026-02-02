import {model,models, Schema,Types } from "mongoose";

export interface IVote {
    author: Types.ObjectId; // refereance to the uses 
    id: Types.ObjectId; // refereance to the user 
    type: string; // question or answer
    voteType: string; // upvote or downvote 

};

const VoteSchema = new Schema<IVote>({
  author:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  id:{
    type:Schema.Types.ObjectId,
    required:true
  },
  type:{
    type:String,
    enum:["question","answer"],
    required:true   
  },
  voteType:{
    type:String,
    enum:["upvote","downvote"],
    required:true
  }
  
},{
    timestamps:true,
}
)


const Vote =models?.Vote || model<IVote >("Vote",VoteSchema);

export default Vote;