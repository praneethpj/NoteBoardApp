const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => {
  console.log("Database connected");
}).catch(error => {
  console.log(error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const typedContentSchema = new mongoose.Schema({
  content: String,
});

const TypedContent = mongoose.model('TypedContent', typedContentSchema);

module.exports = { db, TypedContent };
