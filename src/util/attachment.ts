// Function that allows to convert bytes into a more common format

type HumanFileSizeProps = {
  bytes: number;
  si: boolean;
  dp: number;
};

export function humanFileSize({
  bytes,
  si = false,
  dp = 1,
}: HumanFileSizeProps) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );
  return `${bytes.toFixed(dp)} ${units[u]}`;
}
