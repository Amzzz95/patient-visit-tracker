import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const toLocalDateTimeValue = (date = new Date()) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

export function NewVisitForm({ clinicians, patients, onSaved, api }) {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      clinicianId: "",
      patientId: "",
      visitedAt: toLocalDateTimeValue(),
      notes: "",
    },
  });

  const maxVisitedAt = new Date();

  async function onSubmit(data) {
    try {
      if (!data.clinicianId || !data.patientId) {
        throw new Error("Choose a clinician and patient");
      }

      const selectedVisitDate = new Date(data.visitedAt);
      if (Number.isNaN(selectedVisitDate.getTime()) || selectedVisitDate > maxVisitedAt) {
        throw new Error("Visit date cannot be in the future.");
      }

      await api("visits", {
        method: "POST",
        body: data,
      });

      toast({
        title: "Visit recorded",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      reset({
        clinicianId: "",
        patientId: "",
        visitedAt: toLocalDateTimeValue(),
        notes: "",
      });

      onSaved();
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
      className="panel-card"
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
      <Heading as="h3" className="section-title" size="sm" mb={4} color="teal.700" _dark={{ color: "teal.200" }}>
        Record a visit
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">Clinician</FormLabel>
            <Select
              {...register("clinicianId", {
                required: "Clinician is required",
              })}
              placeholder="Choose clinician"
              size="sm"
              isInvalid={!!errors.clinicianId}
            >
              {clinicians.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm">Patient</FormLabel>
            <Select
              {...register("patientId", {
                required: "Patient is required",
              })}
              placeholder="Choose patient"
              size="sm"
              isInvalid={!!errors.patientId}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm">Visit time</FormLabel>
            <input
              {...register("visitedAt", {
                required: "Visit time is required",
                validate: (value) => {
                  if (!value) return "Visit time is required";

                  const selectedVisitDate = new Date(value);
                  if (Number.isNaN(selectedVisitDate.getTime())) {
                    return "Enter a valid visit date and time";
                  }

                  if (selectedVisitDate > new Date()) {
                    return "Visit date cannot be in the future";
                  }

                  return true;
                },
              })}
              type="datetime-local"
              className="datetime-field"
              max={toLocalDateTimeValue()}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Notes (optional)</FormLabel>
            <Textarea
              {...register("notes")}
              placeholder="Add any notes about the visit"
              rows={3}
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
            Save visit
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
