import ColorThief from "colorthief";

export default async function getBackgroundByAvatar(avatar: HTMLImageElement) {
  const colorThief = new ColorThief();

  const primaryColor = colorThief.getColor(avatar);
  const r = primaryColor[0];
  const g = primaryColor[1];
  const b = primaryColor[2];

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isLight = luminance > 0.5;

  let secondaryColor = [0, 0, 0];

  if (isLight) {
    secondaryColor = [
      r - 50 < 0 ? 0 : r - 50,
      g - 50 < 0 ? 0 : g - 50,
      b - 50 < 0 ? 0 : b - 50,
    ];
  } else {
    secondaryColor = [
      r + 50 > 255 ? 255 : r + 50,
      g + 50 > 255 ? 255 : g + 50,
      b + 50 > 255 ? 255 : b + 50,
    ];
  }

  return `linear-gradient(90deg,rgb(${primaryColor.join(", ")}) 0%, rgb(${secondaryColor.join(", ")}) 100%)`;
}
