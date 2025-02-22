import { DEFAULT_LANG, languageByValue, languages } from "./constants";

export const getFirstNextLanguage = (language: string) => {
  const languageOption = languages.find(({ value }) => value !== language);

  return languageOption?.value ?? languages[0].value;
};

export const getVoiceByLanguage = (language: string) => {
  const languageConfig = languageByValue[language];

  const voices = speechSynthesis.getVoices();

  const voice = voices.find(({ lang }) => lang === languageConfig.lang);

  if (voice) return voice;

  const defaultVoice = voices.find(({ lang }) => lang === DEFAULT_LANG);

  return defaultVoice ?? voices[0];
};

const BASE64_MARKER = ";base64,";

export async function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target === null) return reject(new Error("No target"));
      resolve(event.target.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export function base64ToUint8Array(dataURI: string) {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export function dataURLtoFile(
  dataurl: string,
  filename = "default-name"
) {
  let arr = dataurl.split(","),
    reg = /:(.*?);/,
    mime = reg.exec(arr[0])?.[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function convertUint8ArrayToBase64(array: Uint8Array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return globalThis.btoa(latin1string);
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!Number(bytes)) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
