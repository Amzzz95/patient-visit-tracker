import {
  Box,
  Heading,
  VStack,
  HStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  TableContainer,
} from "@chakra-ui/react";

const fmt = (iso) =>
  new Date(iso).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function VisitLog({
  visits,
  clinicians,
  patients,
  filter,
  onFilterChange,
}) {
  return (
    <Box
      flex={1}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="lg"
      p={4}
      borderWidth="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
      w="100%"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" flexWrap="wrap" gap={2}>
          <Heading as="h2" size="sm">
            Visit log
            <Badge ml={2} colorScheme="brand">
              {visits.length}
            </Badge>
          </Heading>
          <HStack spacing={2}>
            <Select
              placeholder="All clinicians"
              size="sm"
              maxW="180px"
              value={filter.clinicianId}
              onChange={(e) =>
                onFilterChange({ ...filter, clinicianId: e.target.value })
              }
            >
              {clinicians.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              placeholder="All patients"
              size="sm"
              maxW="180px"
              value={filter.patientId}
              onChange={(e) =>
                onFilterChange({ ...filter, patientId: e.target.value })
              }
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>

        <Box overflowX="auto">
          <TableContainer>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr bg="gray.50" _dark={{ bg: "gray.700" }}>
                  <Th>Visit</Th>
                  <Th>Patient</Th>
                  <Th>Clinician</Th>
                  <Th>Notes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {visits.length > 0 ? (
                  visits.map((v) => (
                    <Tr
                      key={v.id}
                      _hover={{ bg: "gray.50" }}
                      _dark={{ _hover: { bg: "gray.700" } }}
                    >
                      <Td fontSize="sm" fontVariantNumeric="tabular-nums">
                        {fmt(v.visited_at)}
                      </Td>
                      <Td>{v.patient_name}</Td>
                      <Td>{v.clinician_name}</Td>
                      <Td fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                        {v.notes || "—"}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={6}>
                      <Text color="gray.500">
                        No visits match. Record one, or clear the filters.
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  );
}
