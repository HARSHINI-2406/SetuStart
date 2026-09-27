import { en } from './en';
import { hi } from './hi';
import { te } from './te';
import { ta } from './ta';
import { mr } from './mr';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'mr';

export const translations: Record<Language, typeof en> = {
  en,
  hi,
  te,
  ta,
  mr
};

export const getTranslation = (lang: Language, path: string, params?: Record<string, string>): string => {
  const langDict = translations[lang] || translations.en;
  const keys = path.split('.');
  
  let val: any = langDict;
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      val = undefined;
      break;
    }
  }

  // Fallback to English if not found in target language
  if (val === undefined && lang !== 'en') {
    let fallbackVal: any = translations.en;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    val = fallbackVal;
  }

  if (typeof val !== 'string') {
    return path;
  }

  // Replace parameters like {email}
  if (params) {
    Object.keys(params).forEach(pKey => {
      val = (val as string).replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
    });
  }

  return val;
};
