import mongoose from "mongoose";

const CommandSchema = new mongoose.Schema({
  meterNo: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  command: {
    type: String,
    required: true,
  },
});

export const CommandModel = mongoose.model("Commands", CommandSchema);
