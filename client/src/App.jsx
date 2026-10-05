import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { NewVisitForm } from "./forms/NewVisitForm.jsx";
import { Roster } from "./components/Roster.jsx";
import { VisitLog } from "./components/VisitLog.jsx";
import { api } from "./utils/api.js";

export default function App() {
  const [clinicians, setClinicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState({ clinicianId: "", patientId: "" });
  const [loadError, setLoadError] = useState("");

  const loadPeople = useCallback(async () => {
    try {
      setClinicians(await api("clinicians"));
      setPatients(await api("patients"));
    } catch (e) {
      setLoadError(e.message);
    }
  }, []);

  const loadVisits = useCallback(async () => {
    try {
      const qs = new URLSearchParams(
        Object.entries(filter).filter(([, v]) => v)
      );
      setVisits(await api(`visits?${qs}`));
    } catch (e) {
      setLoadError(e.message);
    }
  }, [filter]);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  return (
    <ErrorBoundary>
      <Box
        className="app-shell"
        minH="100vh"
        py={8}
        _dark={{
          bgImage:
            "linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.82)), url('https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=60')",
        }}
      >
        <Container maxW="6xl">
          <VStack align="stretch" spacing={6}>
            <Box
              className="page-header"
              bg="whiteAlpha.800"
              _dark={{ bg: "whiteAlpha.100" }}
              borderRadius="2xl"
              p={5}
              borderWidth="1px"
              borderColor="teal.100"
              _dark={{ borderColor: "gray.700" }}
              boxShadow="sm"
            >
              <Heading
                as="h1"
                size="lg"
                mb={2}
                color="teal.800"
                _dark={{ color: "teal.200" }}
              >
                Patient visits
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Track who was seen, by whom, and when.
              </Text>
            </Box>

            {loadError && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                Can't reach the API: {loadError}. Is the server running?
              </Alert>
            )}

            <HStack
              align="start"
              spacing={6}
              flexDirection={{ base: "column", lg: "row" }}
            >
              <VStack
                w={{ base: "100%", lg: "350px" }}
                spacing={4}
                flexShrink={0}
              >
                <NewVisitForm
                  clinicians={clinicians}
                  patients={patients}
                  onSaved={loadVisits}
                  api={api}
                />
                <Roster
                  title="Clinicians"
                  items={clinicians}
                  sub="specialty"
                  empty="No clinicians yet."
                  onAdded={loadPeople}
                  api={api}
                  type="clinician"
                />
                <Roster
                  title="Patients"
                  items={patients}
                  sub="date_of_birth"
                  empty="No patients yet."
                  onAdded={loadPeople}
                  api={api}
                  type="patient"
                />
              </VStack>

              <VisitLog
                visits={visits}
                clinicians={clinicians}
                patients={patients}
                filter={filter}
                onFilterChange={setFilter}
              />
            </HStack>
          </VStack>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

export { api } from "./utils/api.js";
