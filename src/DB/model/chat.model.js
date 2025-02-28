import mongoose , {Schema, model,Types} from 'mongoose';





const chatSchema = new Schema({
  senderId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    message: {
      type: String,
      required: true,
      trim: true
    },
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
}, { timestamps: true });


export const chatModel = mongoose.models.Chat||model('Chat', chatSchema);


