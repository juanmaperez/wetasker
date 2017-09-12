const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    name : String,
    color: String,
    _tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', required: true }],
    _creator : { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
});

module.exports = mongoose.model('Project', projectSchema);