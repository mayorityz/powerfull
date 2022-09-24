import mongoose from "mongoose";

const CommandSchema = new mongoose.Schema(
  {
    meterNumber: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
    },
    cmd: {
      type: String,
      required: true,
    },
    SODNumber: {
      type: String,
    },
    broadcastAddress: {
      type: String,
    },
    meterResponse: {
      type: [String],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CommandSchema.virtual("command").get(function () {
  let command = `?${this.cmd}=${this.meterNumber}`;
  if (this.SODNumber) {
    command += `,${this.SODNumber}!`;
  } else if (this.broadcastAddress) {
    command += `,${this.broadcastAddress}!`;
  } else {
    command += "!";
  }
  return command;
});

export const CommandModel = mongoose.model("Commands", CommandSchema);
