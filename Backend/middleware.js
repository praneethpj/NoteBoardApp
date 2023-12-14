const socketIO = require('socket.io');

module.exports = (server, TypedContent) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONT_END_URL,
    },
  });

  let previousMessage = "";
  let updatedTexts = "";

  io.on('connection', async (socket) => {
    console.log(`Socket ${socket.id} connected`);
  
    try {
      const result = await TypedContent.find();
      updatedTexts = result[0]?.content ?? previousMessage;
      io.emit('updatedText', updatedTexts);
   } catch (err) {
      console.log("err " + err);
   }

    socket.on('sendText', async (messageObject) => {
      const { newValue } = messageObject;
      const message = { content: newValue };

      io.emit('updatedText', message.content); 
      previousMessage = message.content;
    });

    socket.on('disconnect', async () => {
      console.log(`Socket ${socket.id} disconnected`);
      await TypedContent.deleteMany({});
      previousMessage = previousMessage ?? updatedTexts;
      const newTypedContent = new TypedContent({ "content": previousMessage });
      await newTypedContent.save();
      console.log("Saved Text " + previousMessage);
    });
  });

  return io;
};
