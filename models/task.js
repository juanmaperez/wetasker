const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    project : String,
    priority: Number,
    done: { type: Boolean, default: false},
    _creator : { type: Schema.Types.ObjectId, ref: 'User', required: true },  
    _project : { type: Schema.Types.ObjectId, ref: 'Project', required: true }, 
    googleID: String

  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  });


  module.exports = mongoose.model('Task', taskSchema);