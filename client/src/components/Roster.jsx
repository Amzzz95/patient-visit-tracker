import { useState, useOptimistic } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export function Roster({
  title,
  items,
  sub,
  empty,
  onAdded,
  api,
  type,
}) {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const extraKey = type === "clinician" ? "specialty" : "date_of_birth";
  const extraLabel = type === "clinician" ? "Specialty" : "Date of birth";
  const path = type === "clinician" ? "clinicians" : "patients";
  const [selectedId, setSelectedId] = useState("");

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem) => [...state, newItem]
  );

  const selectedItem = optimisticItems.find((item) => String(item.id) === String(selectedId)) || null;

  async function onSubmit(data) {
    try {
      const newItem = {
        id: Date.now(),
        name: data.name,
        [extraKey]: data[extraKey] || null,
      };
      addOptimisticItem(newItem);

      await api(path, {
        method: "POST",
        body: { name: data.name, [extraKey]: data[extraKey] },
      });

      reset();
      toast({
        title: `${type} added`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      onAdded();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <Box
      className="panel-card roster-panel"
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="2xl"
      p={4}
      borderWidth="1px"
      borderColor="teal.100"
      _dark={{ borderColor: "gray.700" }}
      w="100%"
      boxShadow="md"
    >
      <HStack justify="space-between" mb={3}>
        <Heading as="h3" className="section-title" size="sm" color="teal.700" _dark={{ color: "teal.200" }}>
          {title}
        </Heading>
        <Badge colorScheme="teal" borderRadius="full" px={2}>
          {optimisticItems.length}
        </Badge>
      </HStack>

      <Box mb={4}>
        <Select
          className="dropdown-select"
          placeholder={`Select a ${type} to view details`}
          size="sm"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
        >
          {optimisticItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>

        {selectedItem ? (
          <Box className="selection-box" mt={3} p={3} borderRadius="md" bg="teal.50" _dark={{ bg: "gray.700" }}>
            <Text fontWeight="600" fontSize="sm">{selectedItem.name}</Text>
            {selectedItem[sub] && (
              <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="xs" mt={1}>
                {selectedItem[sub]}
              </Text>
            )}
          </Box>
        ) : (
          <Text color="gray.500" fontSize="sm" mt={3}>
            {optimisticItems.length ? "Select a name to view details." : empty}
          </Text>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <FormControl>
            <FormLabel fontSize="sm">{type} name</FormLabel>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder={`${title} name`}
              size="sm"
              isInvalid={!!errors.name}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">{extraLabel}</FormLabel>
            <Input
              {...register(extraKey)}
              placeholder={extraLabel}
              type={type === "clinician" ? "text" : "date"}
              size="sm"
            />
          </FormControl>

          <Button
            type="submit"
            className="primary-button"
            colorScheme="brand"
            variant="solid"
            width="100%"
            isLoading={isSubmitting}
            size="sm"
          >
            Add {type}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
