import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, HStack, Text } from "@chakra-ui/react";
import { client } from "../../lib/crud"; // Import the Supabase client

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    const data = await client.getWithPrefix("chat:");
    if (data) {
      setMessages(data);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageKey = `chat:${Date.now()}`;
    const messageValue = { text: newMessage, timestamp: new Date().toISOString() };

    const success = await client.set(messageKey, messageValue);
    if (success) {
      setNewMessage("");
      fetchMessages(); // Refresh messages
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Box p={4} maxW="600px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Box bg="gray.100" p={4} borderRadius="md" boxShadow="md">
          <VStack spacing={3} align="stretch">
            {messages.map((msg) => (
              <HStack key={msg.key} bg="white" p={3} borderRadius="md" boxShadow="sm">
                <Text>{msg.value.text}</Text>
                <Text fontSize="xs" color="gray.500" ml="auto">
                  {new Date(msg.value.timestamp).toLocaleTimeString()}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
        <HStack>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Index;