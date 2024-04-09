import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {};

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Heading mb={4}>Register</Heading>
      <FormControl id="username" mb={4}>
        <FormLabel>Username</FormLabel>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl id="email" mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" mb={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button colorScheme="blue" onClick={register} mb={4}>
        Register
      </Button>
      <Link color="blue.500" onClick={() => navigate("/")}>
        Back to Login
      </Link>
    </Box>
  );
};

export default Register;
