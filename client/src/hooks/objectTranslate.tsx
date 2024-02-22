// This can be put into translate, but I need to reassign all the variables from const t =  to const {translate} =
// So this is a temp fix for testing list of strings

import { useTranslation } from 'react-i18next';

function useObjectTranslator() {
  const { t } = useTranslation<string[]>();

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

  function replaceObjects(text: string) {
    const reg = /\{\{(.*?)\}\}/g;
    const it = text.matchAll(reg);
    let res = it.next();

    const lines = res.done ? [text] : [];

    while (!res.done) {
      lines.push(...translate(`${res.value[1]}`));
      res = it.next();
    }

    return lines;
  }

  function translate(name: string) {
    const ret = t(name, { returnObjects: true });

    if (typeof ret === 'string') {
      return [replaceItemsWithName(ret)];
    }

    const lines: string[] = [];

    (t(name, { returnObjects: true }) as string[])?.forEach((text) => {
      lines.push(...replaceObjects(replaceItemsWithName(text)));
    });

    return lines;
  }

  return translate;
}

export default useObjectTranslator;
