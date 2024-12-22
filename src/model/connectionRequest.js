const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "User" //reference to user collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing in mongoDB - This means that fromUserId will have priority when searching in db "https://mongoosejs.com/docs/api/schema.html#Schema.prototype.index()"
connectionRequestSchema.index({fromUserId:1})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);