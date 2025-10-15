// src/components/ui/CustomTooltip.tsx
import { Tooltip, TooltipProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CustomTooltipProps {
  label: string | ReactNode;
  placement?: TooltipProps["placement"];
  hasArrow?: boolean;
  bg?: string;
  color?: string;
  children: ReactNode;
}

export const CustomTooltip = ({
  label,
  placement = "top",
  hasArrow = false,
  bg,
  color,
  children,
}: CustomTooltipProps) => {
  return (
    <Tooltip
      label={label}
      hasArrow={hasArrow}
      placement={placement}
      {...(bg && { bg })}
      {...(color && { color })}
    >
      {children}
    </Tooltip>
  );
};
