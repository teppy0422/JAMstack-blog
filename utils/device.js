export const isMobileDevice = () => {
  if (typeof navigator !== "undefined") {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  return false;
};

export const isIOSDevice = () => {
  if (typeof navigator !== "undefined") {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  return false;
};
