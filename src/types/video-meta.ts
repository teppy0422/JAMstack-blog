// types/video.ts
export type LocalizedString = {
  ja: string;
  us?: string;
  cn?: string;
};

export type VideoMeta = {
  id: string;
  date: string;
  autoPlay: boolean;
  title: LocalizedString;
  name: LocalizedString;
  textContent: LocalizedString;
  src: string;
  thumbnail: string;
};
