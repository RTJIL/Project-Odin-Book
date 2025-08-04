// utils/sizeConverter.ts
type SizeUnit = "B" | "KB" | "MB" | "GB" | "TB";

interface Options {
  decimals?: number;
  useDecimal?: boolean;
}

export default function sizeConverter(
  sizeInBytes: number,
  { decimals = 2, useDecimal = false }: Options = {}
): string {
  if (isNaN(sizeInBytes) || sizeInBytes < 0) return "0 B";

  const base = useDecimal ? 1000 : 1024;
  const suffixes: SizeUnit[] = useDecimal
    ? ["B", "KB", "MB", "GB", "TB"]
    : ["B", "KiB", "MiB", "GiB", "TiB"] as unknown as SizeUnit[]; 

  if (sizeInBytes < base) return `${sizeInBytes} B`;

  let idx = Math.floor(Math.log(sizeInBytes) / Math.log(base));
  idx = Math.min(idx, suffixes.length - 1);
  const scaled = sizeInBytes / Math.pow(base, idx);
  return `${scaled.toFixed(decimals)} ${suffixes[idx]}`;
}
