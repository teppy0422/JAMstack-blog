import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (
    title: string,
    description: string,
    status: "info" | "warning" | "success" | "error"
  ) => {
    toast({
      title,
      description,
      status,
      duration: 6000,
      isClosable: true,
    });
  };

  return showToast;
};
