import {model,models, Schema,Types } from "mongoose";


export interface IInteraction {
    user: Types.ObjectId; // refereance to the users model 
    action: string; // like, dislike, upvote, downvote
    actionId: Types.ObjectId; // refereance to the question or answer or userID\
   // actionType: string;
    actionType: "question" |"answer"
};

const InteractionSchema = new Schema<IInteraction>({
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  action:{
    type:String,
    required:true
  },
  actionId:{
    type:Schema.Types.ObjectId,
    required:true, // this is the id of the question or answer or userID 
 
  },
  actionType:{
    type:String,
    enum:["question","answer"],
    required:true
  }
  
},{
    timestamps:true,
}
)

// here also we need to check if the model is already defined then reuse it, if it not then create the model
const Interaction =models?.Interaction || model<IInteraction >("Interaction",InteractionSchema);

export default Interaction;