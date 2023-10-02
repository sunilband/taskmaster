import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v: any) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [6, "Password too short"],
  },
},
{timestamps: true}
);
// @ts-ignore
mongoose.models = {};
export const UserModel = mongoose.model("User", schema);
