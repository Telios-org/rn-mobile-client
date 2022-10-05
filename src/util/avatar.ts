export function stringToHslColor(str = '', s, l, opacity = 1) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
}

export const getFirstCharactersFromGivenName = (
  displayName: string = '',
): string => {
  const splitedDisplayName = displayName.split(' ');
  const firstCharacterOfFirstName = splitedDisplayName[0][0] || '';

  const firstCharacterOfLastName =
    (splitedDisplayName.length >= 2 &&
      splitedDisplayName[splitedDisplayName.length - 1]?.[0]) ||
    '';
  return `${firstCharacterOfFirstName}${firstCharacterOfLastName}`.toUpperCase();
};
