import {
  createConversationForListing,
  getConversationDetails,
  listUserConversations,
  sendMessageToConversation,
} from "./messageService.js";

export async function createConversation(req, res) {
  try {
    const result = await createConversationForListing({
      listingId: req.body?.listingId,
      userId: req.user?.sub,
    });

    return res.status(201).json({
      message: "Conversation ready",
      data: result,
    });
  } catch (error) {
    console.error("messageController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function getConversations(req, res) {
  try {
    const result = await listUserConversations(req.user?.sub);

    return res.status(200).json({
      message: "Retrieved conversations",
      data: result,
    });
  } catch (error) {
    console.error("messageController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function getConversation(req, res) {
  try {
    const result = await getConversationDetails(
      req.params?.conversationId,
      req.user?.sub
    );

    return res.status(200).json({
      message: "Retrieved conversation",
      data: result,
    });
  } catch (error) {
    console.error("messageController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function createMessage(req, res) {
  try {
    const result = await sendMessageToConversation({
      conversationId: req.params?.conversationId,
      senderId: req.user?.sub,
      body: req.body?.body,
    });

    return res.status(201).json({
      message: "Message sent",
      data: result,
    });
  } catch (error) {
    console.error("messageController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
