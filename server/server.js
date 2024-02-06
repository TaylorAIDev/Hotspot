require("dotenv").config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const auth = require('./routes/api/auth');
const cors = require('cors');
const Conversation = require('./models/Conversation')
const verifyToken = require('./middleware/verifyToken')

const app = express();
// Connect Database
connectDB();
app.use(cors());
// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', auth);
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/api/allData', async (req, res) => {
  try {
    const data = await Conversation.aggregate([
      { $match: { type: "User" } }, // Match documents where the type is "User"
      { $group: { _id: "$name", phone: { $first: "$phone" } } } // Group by name and retrieve the first phone number
    ]); // Retrieve all data from the collection

    const contacts = data.map((dataItem, index) => ({
      "status": "busy",
      "id": dataItem.phone,
      "role": "HR Manager",
      "email": "nannie_abernathy70@yahoo.com",
      "name": dataItem._id,
      "lastActivity": "2024-01-24T11:26:56.016Z",
      "address": "19034 Verna Unions Apt. 164 - Honolulu, RI / 87535",
      "avatarUrl": `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg`,
      "phoneNumber": dataItem.phone
    }))
    const allIds = data.map((dataItem) => dataItem.phone)
    const byId = await Promise.all(allIds.map(async (contactItem) => {
      const data_name = await Conversation.aggregate([
        { $match: { type: "User", phone: contactItem } }, // Match documents where the type is "User" and the phone matches the given phone number
        { $group: { _id: "$name" } }, // Group by name to retrieve unique names
        { $project: { _id: 0, name: "$_id" } } // Project the renamed 'name' field and exclude the '_id' field
      ]);
      let messages = await Conversation.find({ phone: contactItem });
      // Assuming 'messages' is the array of messages
      messages = messages.map((message, index) => ({
        "id": message.phone,
        "body": index === messages.length - 1 ? message.message : "",
        "contentType": "text",
        "attachments": [],
        "createdAt": message.createdAt,
        "senderId": message.name
      }));


      return {
        [contactItem]: {
          "id": contactItem,
          "participants": [
            {
              "status": "online",
              "id": data_name[0].name,
              "role": "admin",
              "email": "demo@minimals.cc",
              "name": data_name[0].name,
              "lastActivity": "2024-01-24T10:12:50.677Z",
              "address": "90210 Broadway Blvd",
              "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg",
              "phoneNumber": "+40 777666555"
            },
            {
              "status": "online",
              "id": "Ai-BOT",
              "role": "UX/UI Designer",
              "email": "violet.ratke86@yahoo.com",
              "name": "Ai-BOT",
              "lastActivity": "2024-01-21T07:12:50.677Z",
              "address": "110 Lamar Station Apt. 730 - Hagerstown, OK / 49808",
              "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg",
              "phoneNumber": "692-767-2903"
            }
          ],
          "type": "ONE_TO_ONE",
          "unreadCount": 0,
          "messages": messages
        }
      };
    }));
    const byIdObject = byId.reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      acc[key] = curr[key];
      return acc;
    }, {});

    const conversations = {
      "byId": byIdObject, allIds
    }
    const finalData = {
      "contacts1": contacts, "conversations1": conversations
    }
    res.json(finalData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/chat',verifyToken, async (req, res) => {
  const conversationalId = req.query.conversationId;
  const data = await Conversation.aggregate([
    { $match: { type: "User", phone: conversationalId } }, // Match documents where the type is "User" and the phone matches the given phone number
    { $group: { _id: "$name" } }, // Group by name to retrieve unique names
    { $project: { _id: 0, name: "$_id" } } // Project the renamed 'name' field and exclude the '_id' field
  ]);
  console.log('----', data)
  const getConversation = async () => {
    try {
      let messages = await Conversation.find({ phone: conversationalId });
      messages = messages.map(message => ({
        "id": message._id,
        "body": message.message,
        "contentType": "text",
        "attachments": [],
        "type": message.type,
        "createdAt": message.createdAt, // Assuming this field exists in your Conversation model
        "senderId": message.name
      }));

      return {
        "id": conversationalId,
        "participants": [
          {
            "status": "online",
            "id": data[0].name,
            "role": "admin",
            "email": "demo@minimals.cc",
            "name": data[0].name,
            "lastActivity": "2024-01-24T10:12:50.677Z",
            "address": "90210 Broadway Blvd",
            "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg",
            "phoneNumber": "+40 777666555"
          },
          {
            "status": "online",
            "id": "Ai-BOT",
            "role": "UX/UI Designer",
            "email": "violet.ratke86@yahoo.com",
            "name": "Ai-BOT",
            "lastActivity": "2024-01-21T07:12:50.677Z",
            "address": "110 Lamar Station Apt. 730 - Hagerstown, OK / 49808",
            "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg",
            "phoneNumber": "692-767-2903"
          }
        ],
        "type": "ONE_TO_ONE",
        "unreadCount": 0,
        "messages": messages

      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null; // Handle error or provide appropriate response
    }
  };
  const conversation = await getConversation();
  if (conversation) {
    res.json({ conversation: conversation });
  } else {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

app.get('/api/status', async (req,res) => {
  res.json({"status":"ok"})
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

