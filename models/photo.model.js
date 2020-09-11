import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema(
  {
    album: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    raw: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: false,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

photoSchema.method({});

const Photo = mongoose.model("photo", photoSchema);

export default Photo;
