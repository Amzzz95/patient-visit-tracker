import React from "react";
import { Box, Heading, Text, VStack, Alert, AlertIcon } from "@chakra-ui/react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh" py={8}>
          <VStack spacing={4} maxW="2xl" mx="auto">
            <Alert status="error" flexDirection="column" borderRadius="md">
              <AlertIcon />
              <Heading as="h2" size="md" mt={4} mb={2}>
                Something went wrong
              </Heading>
              <Text>{this.state.error?.message}</Text>
            </Alert>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
