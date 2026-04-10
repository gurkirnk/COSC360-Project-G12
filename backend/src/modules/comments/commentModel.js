import mongoose from "mongoose";

function transformDocument(_document, returnedObject) {
  returnedObject.id = returnedObject._id.toString();
  delete returnedObject._id;
  return returnedObject;
}

const commentSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      required: false,
      ref: "Comment",
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "comments",
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: transformDocument,
    },
    toObject: {
      virtuals: true,
      transform: transformDocument,
    },
  }
);

commentSchema.pre('validate', function(next) {
  if (!this.listingId && !this.parentCommentId) {
    return next(new Error('Either listingId or parentCommentId must be populated'));
  }
  return next();
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
