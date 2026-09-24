export function toHalfWidthNumber(value: string): string {
  return value.replace(/[０-９．]/g, (ch) =>
    ch === "．" ? "." : String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
}

export function makeHalfWidthOnInput(setValue: (v: string) => void) {
  return (e: React.FormEvent<HTMLInputElement>) => {
    const converted = toHalfWidthNumber(e.currentTarget.value);
    if (converted !== e.currentTarget.value) {
      e.currentTarget.value = converted;
      setValue(converted);
    }
  };
}
