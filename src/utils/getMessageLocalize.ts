// utils/getMessageLocalize.ts
import getMessage from "@/utils/getMessage";

type LocalizedOnly = {
  ja?: string;
  us?: string;
  cn?: string;
};

export function GetMessageLocalize(
  obj: LocalizedOnly,
  language: string
): string {
  return getMessage({ ...obj, language });
}
