import { useEffect, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideCodex } from '../../slices/panelSlice';
import { ASSET_CONFIG } from '../../util/assetConfig';
import { SERVER_CONFIG } from '../../util/serverConfig';
import useTranslator from '../../hooks/translate';
import { JScrollPane } from '../../components/UI/JScollPane';
import { JImage } from '../../components/UI/JImage';
import { getItemSrc } from '../../resources/Items';
import { Label } from '../../components/UI/Label';

export function Codex() {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const isCodexOpen = useAppSelector((state) => state.panels.codex);
  const [typeMap, setTypeMap] = useState<{ [type: string]: [number] }>({});
  const [selectedType, setSelectedType] = useState('');
  const [selectedItem, setSelectedItem] = useState<number>();

  useEffect(() => {
    const map: any = {};

    Object.entries(ASSET_CONFIG.ITEMS ?? {}).forEach(([id, data]: [string, any]) => {
      if (map[data[3]] === undefined) {
        map[data[3]] = [];
      }

      map[data[3]].push(Number(id));
    });

    setTypeMap(map);
    setSelectedType('0');
  }, []);

  if (!isCodexOpen) {
    return null;
  }

  return (
    <Panel name="Codex" onClose={() => dispatch(hideCodex())}>
      <JPanel width={500} height={500} background="UIResource.Common.BigBG1" padding={4}>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: 200 }}>
          {Object.keys(typeMap).map((type) => (
            <option key={type} value={type}>
              {t(`item_type__${type}`)}
            </option>
          ))}
          <option value={20000}>Pet Tracing</option>
          <option value={20001}>Tasks</option>
          <option value={20002}>Demon Boss</option>
        </select>

        <JScrollPane size={{ width: 200, height: 470 }}>
          {typeMap[selectedType]?.map((id) => (
            <div key={id} className="clickable" onClick={() => setSelectedItem(id)}>
              {t(`item__${id}--name`)}
            </div>
          ))}

          {Number(selectedType) >= 20000 &&
            Object.keys(ASSET_CONFIG.ITEMS)
              .filter((id) => ASSET_CONFIG.ITEMS[id][4]?.[Number(selectedType) - 20000] === 1)
              .map((id) => (
                <div key={id} className="clickable" onClick={() => setSelectedItem(Number(id))}>
                  {t(`item__${id}--name`)}
                </div>
              ))}
        </JScrollPane>

        <JPanel y={0} x={210}>
          {selectedItem && <CodexItem id={selectedItem} />}
        </JPanel>
      </JPanel>
    </Panel>
  );
}

function CodexItem({ id }: { id: number }) {
  const t = useTranslator();
  const data = ASSET_CONFIG.ITEMS[id];

  console.log(data);

  return (
    <JPanel width={200}>
      <Label text={t(`item__${id}--name`)} />
      <JImage src={`icons/items/${data[0]}.png`} />

      {data[4]?.[0] === 1 && <div>Pet Tracing</div>}
      {data[4]?.[1] === 1 && <div>Tasks</div>}
      {data[4]?.[2] === 1 && <div>Demon Boss</div>}
    </JPanel>
  );
}
