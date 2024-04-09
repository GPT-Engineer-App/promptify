import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:1337/api";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [promptName, setPromptName] = useState("");
  const [promptText, setPromptText] = useState("");
  const [editingPromptId, setEditingPromptId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchPrompts(token);
    }
  }, []);

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.jwt);
        setIsLoggedIn(true);
        fetchPrompts(data.jwt);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Registration failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const fetchPrompts = async (token) => {
    try {
      const response = await fetch(`${API_URL}/prompts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrompts(data.data);
      } else {
        console.error("Failed to fetch prompts");
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const createPrompt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { name: promptName, prompt: promptText } }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrompts([...prompts, data.data]);
        setPromptName("");
        setPromptText("");
        toast({
          title: "Prompt created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to create prompt",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  const updatePrompt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts/${editingPromptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { name: promptName, prompt: promptText } }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPrompts = prompts.map((prompt) => (prompt.id === editingPromptId ? data.data : prompt));
        setPrompts(updatedPrompts);
        setEditingPromptId(null);
        setPromptName("");
        setPromptText("");
        toast({
          title: "Prompt updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to update prompt",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const deletePrompt = async (promptId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/prompts/${promptId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPrompts = prompts.filter((prompt) => prompt.id !== promptId);
        setPrompts(updatedPrompts);
        toast({
          title: "Prompt deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to delete prompt",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPrompts([]);
  };

  if (!isLoggedIn) {
    return (
      <Box maxWidth="400px" margin="auto" mt={8}>
        <Heading mb={4}>Login</Heading>
        <FormControl id="username" mb={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="password" mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={login} mb={4}>
          Login
        </Button>
        <Text>
          Don't have an account?{" "}
          <Link color="blue.500" onClick={() => setIsLoggedIn(false)}>
            Register
          </Link>
        </Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="auto" mt={8}>
      <Heading mb={4}>Prompts</Heading>
      <Stack spacing={4}>
        {prompts.map((prompt) => (
          <Box key={prompt.id} p={4} borderWidth={1} borderRadius="md">
            <Heading size="md">{prompt.attributes.name}</Heading>
            <Text>{prompt.attributes.prompt}</Text>
            <Stack direction="row" mt={4}>
              <Button
                leftIcon={<FaEdit />}
                onClick={() => {
                  setEditingPromptId(prompt.id);
                  setPromptName(prompt.attributes.name);
                  setPromptText(prompt.attributes.prompt);
                }}
              >
                Edit
              </Button>
              <Button leftIcon={<FaTrash />} onClick={() => deletePrompt(prompt.id)}>
                Delete
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
      <Box mt={8}>
        <Heading size="md" mb={4}>
          {editingPromptId ? "Edit Prompt" : "Create Prompt"}
        </Heading>
        <FormControl id="promptName" mb={4}>
          <FormLabel>Prompt Name</FormLabel>
          <Input type="text" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
        </FormControl>
        <FormControl id="promptText" mb={4}>
          <FormLabel>Prompt Text</FormLabel>
          <Input type="text" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
        </FormControl>
        <Button leftIcon={<FaPlus />} onClick={editingPromptId ? updatePrompt : createPrompt}>
          {editingPromptId ? "Update Prompt" : "Create Prompt"}
        </Button>
      </Box>
      <Button mt={8} onClick={logout}>
        Logout
      </Button>
    </Box>
  );
};

export default Index;
