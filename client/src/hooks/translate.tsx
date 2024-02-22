import { UseTranslationOptions, useTranslation } from 'react-i18next';

function useTranslator() {
  const { t } = useTranslation();

  function replaceItemsWithName(text: string) {
    const reg = /\[\[(.*?)\]\]/g;
    const it = text.matchAll(reg);
    let res = it.next();

    while (!res.done) {
      text = text.replace(res.value[0], t(`${res.value[1]}`));
      res = it.next();
    }

    return text;
  }

  function translate(name: string) {
    return replaceItemsWithName(t(name));
  }

  return translate;
}

export default useTranslator;
