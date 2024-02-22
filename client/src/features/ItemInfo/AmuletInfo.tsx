import * as React from 'react';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LevelInfo } from './components/LevelInfo';
import { LineBreak } from './components/LineBreak';
import { LineInfo } from './LineInfo';
import { GemSlotInfo } from './components/GemSlotInfo';
import { SetInfo } from './components/SetInfo';
import { EnchantSlotInfo } from './components/EnchantSlotInfo';

export const AmuletInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const props = item.props || { level: 1, def: 0 };

  return (
    <>
      <div style={{ color: 'whitesmoke' }}>
        <BaseInfo item={item}></BaseInfo>
        <LineBreak />
        <LevelInfo level={props.level} />
        {/* <div style={{position: 'relative'}}>Synthesis Value <span style={{position: 'absolute', right: 0}}>42</span></div>
			<LineBreak /> */}
        {/* <div style={{position: 'relative'}}>Defense <span style={{position: 'absolute', right: 0}}>{props.defense}</span></div> */}
        {/* <LineBreak /> */}
        {/* <div style={{position: 'relative'}}>Inscription + 0</div>
			<div style={{position: 'relative'}}>Min Attack<span style={{position: 'absolute', right: 0}}>+0</span></div>
			<div style={{position: 'relative'}}>Max Attack<span style={{position: 'absolute', right: 0}}>+0</span></div>
			<LineBreak /> */}
        <LineInfo lines={props.lines} />
        {/* <LineBreak />
			<div style={{position: 'relative'}}>Enhanced Level<span style={{position: 'absolute', right: 0}}>0 / 12</span></div>
			<div style={{position: 'relative'}}>Enchantment<span style={{position: 'absolute', right: 0}}>0 / 1</span></div> */}
        {props.gems && <GemSlotInfo gems={props.gems} />}
        {props.set && (
          <>
            <LineBreak />
            <SetInfo setId={props.set} />
          </>
        )}

        <EnchantSlotInfo item={item} />
      </div>
    </>
  );
};
