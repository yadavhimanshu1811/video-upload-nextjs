import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUSer{
    email: string;
    password:string;
    _id?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUSer>(
    { 
       email: {type:String, required:true, unique:true},
       password: {type:String, required:true},
    },
    {
        timestamps: true
    }
)


//Writing pre hook to crypt password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

const User = models?.User || model<IUSer>("User", userSchema) // If User Model already, take from there; else create new

export default User;