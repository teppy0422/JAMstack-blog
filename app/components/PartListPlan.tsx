"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Heading,
  HStack,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Part {
  id: number;
  maker: string;
  name: string;
  unitPrice: number;
  model: string;
  url: string;
  power: number | null;
  memo: string;
}

interface PartListData {
  title: string;
  note: string;
  parts: Part[];
}

interface ProjectData {
  projectName: string;
  parts: { id: number; quantity: number }[];
}

interface PlanData {
  planName: string;
  note?: string;
  notice?: string;
  projects: { path: string; sets: number }[];
}

interface PartListPlanProps {
  planPaths: string[];
  masterPath?: string;
}

export default function PartListPlan({
  planPaths,
  masterPath = "/partlist/list.json",
}: PartListPlanProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [master, setMaster] = useState<PartListData | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [projectCache, setProjectCache] = useState<Record<string, ProjectData>>(
    {},
  );
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [setsOverrides, setSetsOverrides] = useState<
    Record<string, Record<string, number>>
  >({});
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const load = async () => {
      const masterRes = await fetch(masterPath);
      const masterData: PartListData = await masterRes.json();
      setMaster(masterData);

      const loadedPlans: PlanData[] = [];
      const cache: Record<string, ProjectData> = {};
      const overrides: Record<string, Record<string, number>> = {};

      for (const planPath of planPaths) {
        const planRes = await fetch(planPath);
        const plan: PlanData = await planRes.json();
        loadedPlans.push(plan);

        const planOverride: Record<string, number> = {};
        for (const proj of plan.projects) {
          planOverride[proj.path] = proj.sets;
          if (!cache[proj.path]) {
            const projRes = await fetch(`/partlist/projects/${proj.path}`);
            cache[proj.path] = await projRes.json();
          }
        }
        overrides[planPath] = planOverride;
      }

      setPlans(loadedPlans);
      setProjectCache(cache);
      setSetsOverrides(overrides);
    };
    load();
  }, [planPaths, masterPath]);

  const activePlan = plans[activePlanIndex];
  const activePlanPath = planPaths[activePlanIndex];

  const partMap = useMemo(() => {
    if (!master) return {};
    const map: Record<number, Part> = {};
    master.parts.forEach((p) => (map[p.id] = p));
    return map;
  }, [master]);

  const calcProjectSubtotal = (proj: ProjectData): number => {
    return proj.parts.reduce(
      (sum, p) => sum + (partMap[p.id]?.unitPrice || 0) * p.quantity,
      0,
    );
  };

  const setSetsForProject = (path: string, val: number) => {
    setSetsOverrides((prev) => ({
      ...prev,
      [activePlanPath]: {
        ...prev[activePlanPath],
        [path]: val,
      },
    }));
  };

  const getSets = (path: string): number => {
    return setsOverrides[activePlanPath]?.[path] ?? 0;
  };

  const toggleExpand = (path: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const grandTotal = useMemo(() => {
    if (!activePlan) return 0;
    return activePlan.projects.reduce((sum, proj) => {
      const project = projectCache[proj.path];
      if (!project) return sum;
      const sets = getSets(proj.path);
      return sum + calcProjectSubtotal(project) * sets;
    }, 0);
  }, [activePlan, projectCache, setsOverrides, partMap]);

  if (!master || plans.length === 0) return <Text>読み込み中...</Text>;

  const bgCard = isDark ? "gray.700" : "white";
  const bgHeader = isDark ? "gray.600" : "gray.50";
  const borderColor = isDark ? "gray.600" : "gray.200";
  const totalBg = isDark ? "blue.800" : "blue.50";
  const detailBg = isDark ? "gray.750" : "gray.50";
  const activeBtnBg = isDark ? "#E3836D" : "#503F35";

  return (
    <Box>
      {plans.length > 1 && (
        <HStack mb={4} flexWrap="wrap" gap={2}>
          {plans.map((plan, i) => (
            <Button
              key={i}
              size="sm"
              bg={i === activePlanIndex ? activeBtnBg : undefined}
              color={i === activePlanIndex ? "white" : undefined}
              variant={i === activePlanIndex ? "solid" : "outline"}
              _hover={{}}
              onClick={() => setActivePlanIndex(i)}
            >
              {plan.planName}
            </Button>
          ))}
        </HStack>
      )}

      {/* <Heading size="md" mb={2}>
        {activePlan.planName}
      </Heading> */}
      {activePlan.note && (
        <Text
          fontSize="sm"
          color="gray.500"
          mb={activePlan.notice ? 1 : 4}
          whiteSpace="pre-line"
        >
          {activePlan.note}
        </Text>
      )}
      {activePlan.notice && (
        <Text fontSize="sm" color="red.500" mb={4} whiteSpace="pre-line">
          {activePlan.notice}
        </Text>
      )}

      <Box
        overflowX="auto"
        bg={bgCard}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Table size="sm">
          <Thead>
            <Tr bg={bgHeader} fontSize={{ base: "11px", sm: "14px" }}>
              <Th>プロジェクト</Th>
              <Th isNumeric display={{ base: "none", md: "table-cell" }}>
                セット単価
              </Th>
              <Th isNumeric>セット数</Th>
              <Th isNumeric>小計</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activePlan.projects.map((proj) => {
              const project = projectCache[proj.path];
              if (!project) return null;
              const perSet = calcProjectSubtotal(project);
              const sets = getSets(proj.path);
              const subtotal = perSet * sets;
              const isExpanded = expandedProjects.has(proj.path);
              return (
                <React.Fragment key={proj.path}>
                  <Tr>
                    <Td
                      fontWeight="bold"
                      fontSize={{ base: "11px", sm: "14px" }}
                      cursor="pointer"
                      onClick={() => toggleExpand(proj.path)}
                      userSelect="none"
                    >
                      {isExpanded ? (
                        <ChevronDownIcon mr={1} />
                      ) : (
                        <ChevronRightIcon mr={1} />
                      )}
                      {project.projectName}
                    </Td>
                    <Td isNumeric display={{ base: "none", md: "table-cell" }}>
                      {perSet.toLocaleString()}
                    </Td>
                    <Td isNumeric>
                      <NumberInput
                        size="xs"
                        w={{ base: "50px", sm: "70px" }}
                        min={0}
                        max={999}
                        value={sets}
                        onChange={(_, val) =>
                          setSetsForProject(proj.path, isNaN(val) ? 0 : val)
                        }
                        ml="auto"
                      >
                        <NumberInputField px={2} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Td>
                    <Td
                      isNumeric
                      fontWeight="bold"
                      fontSize={{ base: "11px", sm: "14px" }}
                    >
                      {subtotal.toLocaleString()}
                    </Td>
                  </Tr>
                  {isExpanded &&
                    project.parts.map((pp) => {
                      const part = partMap[pp.id];
                      if (!part) return null;
                      return (
                        <Tr key={`${proj.path}-${pp.id}`} bg={detailBg}>
                          <Td pl={8} fontSize="xs">
                            {part.url ? (
                              <a
                                href={part.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "underline" }}
                              >
                                {part.name}
                              </a>
                            ) : (
                              part.name
                            )}
                            <Text as="span" color="gray.500" ml={1}>
                              ({part.maker})
                            </Text>
                          </Td>
                          <Td
                            isNumeric
                            fontSize="xs"
                            display={{ base: "none", md: "table-cell" }}
                          >
                            {part.unitPrice.toLocaleString()}
                          </Td>
                          <Td isNumeric fontSize="xs">
                            ×{pp.quantity}
                          </Td>
                          <Td isNumeric fontSize="xs">
                            {(
                              part.unitPrice *
                              pp.quantity *
                              sets
                            ).toLocaleString()}
                          </Td>
                        </Tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
            <Tr bg={totalBg}>
              <Td fontWeight="bold" fontSize={{ base: "11px", sm: "14px" }}>
                合計
              </Td>
              <Td display={{ base: "none", md: "table-cell" }} />
              <Td />
              <Td
                isNumeric
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "14px" }}
              >
                {grandTotal.toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
