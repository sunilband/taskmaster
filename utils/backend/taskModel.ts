import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { 
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: function() {
            // @ts-ignore
          return this._id;
        }
      },
    task: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
      required: true,
    },
    user: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);
// @ts-ignore
mongoose.models = {};
export const TaskModel = mongoose.model("Task", schema);
