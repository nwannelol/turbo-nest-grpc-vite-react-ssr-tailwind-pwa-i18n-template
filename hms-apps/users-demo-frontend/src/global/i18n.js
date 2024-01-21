import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const languages = ["en", "es", "fr"];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)

.init({
    lng: "fr",
    fallbackLng: "en", // use en if detected lng is not available
    saveMissing: true, // send not translated keys to endpoint
    //debug: true,
    whitelist: languages,
    ns: ["public","adm"],
    preload: ["fr"],
    defaultNS: "public",

    react: {
      useSuspense: true
    }
  });

export default i18n;
