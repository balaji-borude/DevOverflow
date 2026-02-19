import  {models,model, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // email should be unique
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  reputation: {
    type: Number,
    default: 0,
  },
},
{timestamps:true}
);

// THis check if the model is already defined then reuse it, if it not then create the model
// specialy this happen in the nextjs 
const User = models.User || model<IUser>("User", userSchema);

export default User;
// export default mongoose.model<IUser>("User",userSchema);