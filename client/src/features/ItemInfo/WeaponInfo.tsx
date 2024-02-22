import * as React from 'react';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LevelInfo } from './components/LevelInfo';
import { LineBreak } from './components/LineBreak';
import { LineInfo } from './LineInfo';
import { NameInfo } from './components/NameInfo';
import { GemSlotInfo } from './components/GemSlotInfo';
import { EnchantSlotInfo } from './components/EnchantSlotInfo';
import { CDNImage } from '../../components/Elements/Image';

export const WeaponInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const props = item.props ?? { level: 1, attack: [0, 0], lines: [] };

  const inscribeLevel = item.props?.inscribe ?? 0;
  const inscribeMin = inscribeLevel > 0 ? item!.props!.stats['Inscribe_1']?.roll : 0;
  const inscribeMax = inscribeLevel > 0 ? item!.props!.stats['Inscribe_2']?.roll : 0;

  const enhanceLevel = item.props?.enhance ?? 0;
  const enhanceMin = enhanceLevel > 0 ? item!.props!.stats['Enhance_1']?.roll : 0;
  const enhanceMax = enhanceLevel > 0 ? item!.props!.stats['Enhance_2']?.roll : 0;

  return (
    <>
      <div style={{ color: 'whitesmoke' }}>
        <BaseInfo item={item}></BaseInfo>
        <LineBreak />
        <LevelInfo level={props.level} />
        <LineBreak />
        {/* <div style={{position: 'relative'}}>Synthesis Value <span style={{position: 'absolute', right: 0}}>42</span></div>
			<LineBreak /> */}
        <div style={{ position: 'relative' }}>
          Attack Power{' '}
          <span style={{ position: 'absolute', right: 0 }}>
            {props.attack[0]} - {props.attack[1]}
          </span>
        </div>
        {inscribeLevel > 0 && (
          <>
            <LineBreak />
            {Array.apply(null, Array(inscribeLevel)).map((_, idx) => (
              <CDNImage key={idx} src="ui/UIResource/Icon/Star.png" />
            ))}

            <div style={{ position: 'relative' }}>Inscription + {inscribeLevel}</div>
            <div style={{ position: 'relative' }}>
              Min Attack<span style={{ position: 'absolute', right: 0 }}>+{inscribeMin}</span>
            </div>
            <div style={{ position: 'relative' }}>
              Max Attack<span style={{ position: 'absolute', right: 0 }}>+{inscribeMax}</span>
            </div>
          </>
        )}
        <LineInfo lines={props.lines} />

        {enhanceLevel > 0 && (
          <>
            <LineBreak />
            <div style={{ position: 'relative' }}>
              Enhanced Level<span style={{ position: 'absolute', right: 0 }}>{enhanceLevel} / 12</span>
            </div>
            <div style={{ position: 'relative' }}>
              Min Attack<span style={{ position: 'absolute', right: 0 }}>+{enhanceMin}</span>
            </div>
            <div style={{ position: 'relative' }}>
              Max Attack<span style={{ position: 'absolute', right: 0 }}>+{enhanceMax}</span>
            </div>
          </>
        )}
        <EnchantSlotInfo item={item} />

        {/* <LineBreak />
			<div style={{position: 'relative'}}>Enchantment<span style={{position: 'absolute', right: 0}}>0 / 1</span></div> */}
        {props.gems && <GemSlotInfo gems={props.gems} />}
      </div>
    </>
  );
};
