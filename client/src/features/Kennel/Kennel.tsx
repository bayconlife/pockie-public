import { useContext, useRef, useState } from 'react';
import { DropZone } from '../../components/DropZone/DropZone';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideKennel } from '../../slices/panelSlice';
import { SkillIcon } from '../../components/SkillIcon/SkillIcon';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu';
import { Position } from '../../components/interfaces/Interfaces';
import { ItemContext, ItemContextProvider } from '../../context/ItemContext';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { isItemType } from '../../resources/Items';

export function Kennel() {
  const dispatch = useAppDispatch();

  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const inventory = useAppSelector((store) => store.inventory);
  const show = useAppSelector((state) => state.panels.kennel);
  const storedPets = useAppSelector((state) =>
    Array.apply(null, Array(12)).map((_, idx) => {
      if (ItemLocation.PetStorage + Number(idx) in state.inventory.locations) {
        return state.inventory.items[state.inventory.locations[ItemLocation.PetStorage + Number(idx)]];
      } else {
        return null;
      }
    })
  );

  if (!show) {
    return null;
  }

  const pet = inventory.items[inventory.locations[ItemLocation.Pet]];
  const foodTotal = [1, 2, 3, 4, 5, 6].reduce(
    (sum, idx) => (sum += inventory.items[inventory.locations[ItemLocation.Pet + idx]]?.props?.hunger ?? 0),
    0
  );

  return (
    <ItemContextProvider item={pet}>
      <Panel name="Kennel" onClose={() => dispatch(hideKennel())}>
        <JPanel size={{ width: 421, height: 331 }} layout={<JLayout horizontal style={{ alignItems: 'stretch' }} />}>
          <JPanel background="UIResource.Common.BigBG1" layout={<JLayout />} padding={5}>
            <JPanel size={{ width: 73, height: 20 }} background="UIResource.Common.BigBG3">
              <MultilineLabel size={{ width: 73, height: 20 }} text="Storage" style={{ textAlign: 'center' }} />
            </JPanel>

            <JPagination
              perPage={4}
              items={storedPets}
              render={(items, page) => (
                <JLayout>
                  {items.map((item, idx) => (
                    <DisplayGrid key={page * 4 + idx} size={{ width: 2, height: 2 }}>
                      {item === null && dragging !== null && isItemType(dragging, ItemType.Pet) && (
                        <DropZone
                          onDrop={() => toServer('storePet', { slot: page * 4 + idx, uid: dragging.uid })}
                          location={ItemLocation.PetStorage + page * 4 + idx}
                        />
                      )}
                      {item !== null && <Item item={item} overridePosition={0} />}
                    </DisplayGrid>
                  ))}
                </JLayout>
              )}
              width={70}
              noNumbers
            />
          </JPanel>

          <JPanel size={{ width: 331, height: 331 }} background="UIResource.Common.BigBG1" layout={<JLayout />} padding={5}>
            <JPanel size={{ width: 321, height: 76 }} background="UIResource.Common.BigBG4">
              <JPanel size={{ width: 56, height: 56 }} position={{ x: 10, y: 10 }} background="UIResource.Equip.Pet" padding={2}>
                {/* <MultilineLabel size={{ width: 73, height: 20 }} position={{ x: 0, y: 7 }} text="test" /> */}
                {pet === undefined && dragging !== null && isItemType(dragging, ItemType.Pet) && (
                  <DropZone onDrop={(uid: string) => toServer('petSetPet', uid)} location={ItemLocation.Pet} />
                )}
                {pet && <Item item={pet} overridePosition={0} />}
              </JPanel>

              <JPanel size={{ width: 135, height: 20 }} position={{ x: 80, y: 12 }} background="UIResource.Common.BigBG3">
                <MultilineLabel size={{ width: 135, height: 20 }} position={{ x: 0, y: 0 }} text="Name" />
              </JPanel>

              <JButton size={{ width: 95, height: 20 }} position={{ x: 223, y: 12 }} text="Rename" disabled />
              <JButton size={{ width: 65, height: 20 }} position={{ x: 253, y: 42 }} text="Digestion" disabled />

              <JPanel size={{ width: 155, height: 18 }} position={{ x: 80, y: 45 }} background="" />
              {pet && (
                <MultilineLabel
                  size={{ width: 155, height: 20 }}
                  position={{ x: 80, y: 46 }}
                  text={`Growth: ${pet && pet.props?.exp} / ${pet && pet.props?.needed}`}
                />
              )}
            </JPanel>

            <JPanel size={{ width: 321, height: 65 }} background="UIResource.Common.BigBG4">
              <JPanel size={{ width: 9, height: 58 }} position={{ x: 15, y: 4 }} background="UIResource.Icon.text1" />
              <JPanel size={{ width: 216, height: 55 }} position={{ x: 35, y: 5 }} background="UIResource.Common.BigBG5">
                {[5, 41, 77, 113, 149, 185].map((x, idx) => (
                  <PetFood key={idx} idx={idx} x={x} />
                ))}
              </JPanel>

              <MultilineLabel size={{ width: 56, height: 20 }} position={{ x: 260, y: 14 }} text={'+ ' + foodTotal} />
              <JButton
                size={{ width: 65, height: 20 }}
                position={{ x: 253, y: 35 }}
                text="Feed"
                onClick={() => toServer('petFeed')}
                disabled={pet === undefined}
              />
            </JPanel>

            {/* <JPanel size={{ width: 180, height: 74 }} background="UIResource.Common.BigBG4">
            <JPanel size={{ width: 64, height: 64 }} position={{ x: 5, y: 5 }} background="UIResource.Icon.Grid_HeadPortraitBasetext2" />

            <JPanel size={{ width: 100, height: 20 }} position={{ x: 75, y: 10 }} background="UIResource.Common.BigBG3">
              <MultilineLabel size={{ width: 98, height: 20 }} position={{ x: 2, y: 0 }} text="Digest Time -0%" />
            </JPanel>

            <JPanel size={{ width: 100, height: 20 }} position={{ x: 75, y: 40 }} background="UIResource.Common.BigBG3">
              <MultilineLabel size={{ width: 98, height: 20 }} position={{ x: 2, y: 0 }} text="Feeding Bonus" />
            </JPanel>
          </JPanel> */}

            {/* <JPanel size={{ width: 136, height: 74 }} background="UIResource.Common.BigBG4">
            <JPanel size={{ width: 64, height: 64 }} position={{ x: 5, y: 5 }} background="UIResource.Icon.Grid_HeadPortraitBasetext3" />

            <JButton size={{ width: 65, height: 20 }} position={{ x: 70, y: 27 }} text="Learn" disabled />
          </JPanel> */}

            <JPanel size={{ width: 321, height: 172 }} background="UIResource.Common.BigBG4">
              <SkillRow y={5} unlocked={pet?.props?.skills.unlocked[0]} skills={pet?.props?.skills.aura} />
              {/* <JPanel size={{ width: 9, height: 44 }} position={{ x: 15, y: 7 }} background="UIResource.Icon.text2" /> */}
              <MultilineLabel
                size={{ width: 12, height: 44 }}
                position={{ x: 15, y: 7 }}
                text="AURA"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: -5, color: 'red', userSelect: 'none' }}
                title="Aura"
              />
              <JButton
                size={{ width: 65, height: 20 }}
                position={{ x: 253, y: 20 }}
                text="Discover"
                disabled={(pet?.props?.skills.available ?? 0) <= 0}
                onClick={() => toServer('petDiscover', { type: 0 })}
              />
              <SkillRow y={58} unlocked={pet?.props?.skills.unlocked[1]} skills={pet?.props?.skills.active} />
              {/* <JPanel size={{ width: 9, height: 34 }} position={{ x: 15, y: 60 }} background="UIResource.Icon.text4" /> */}
              <MultilineLabel
                size={{ width: 12, height: 44 }}
                position={{ x: 15, y: 65 }}
                text="AID"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: -5, color: 'red', userSelect: 'none' }}
                title="Aid"
              />
              <JButton
                size={{ width: 65, height: 20 }}
                position={{ x: 253, y: 77 }}
                text="Discover"
                disabled={(pet?.props?.skills.available ?? 0) <= 0}
                onClick={() => toServer('petDiscover', { type: 1 })}
              />
              <SkillRow y={111} unlocked={pet?.props?.skills.unlocked[2]} skills={pet?.props?.skills.passive} />
              {/* <JPanel size={{ width: 9, height: 44 }} position={{ x: 15, y: 111 }} background="UIResource.Icon.text3" /> */}
              <MultilineLabel
                size={{ width: 12, height: 40 }}
                position={{ x: 15, y: 120 }}
                text="PSV"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: -5, color: 'red', userSelect: 'none' }}
                title="Passive"
              />
              <JButton
                size={{ width: 65, height: 20 }}
                position={{ x: 253, y: 127 }}
                text="Discover"
                disabled={(pet?.props?.skills.available ?? 0) <= 0}
                onClick={() => toServer('petDiscover', { type: 2 })}
              />
              <MultilineLabel
                size={{ width: 250, height: 50 }}
                position={{ x: 5, y: 160 }}
                text="Click skill icon for more options"
                style={{ fontSize: 10 }}
              />
            </JPanel>
          </JPanel>
        </JPanel>
      </Panel>
    </ItemContextProvider>
  );
}

function PetFood({ idx, x }: { idx: number; x: number }) {
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const item = useAppSelector((store) => store.inventory.items[store.inventory.locations[ItemLocation.Pet + idx + 1]]);

  return (
    <>
      <JPanel size={{ width: 28, height: 14 }} position={{ x, y: 5 }} background="UIResource.Icon.PetFood1" />
      <JPanel size={{ width: 26, height: 26 }} position={{ x, y: 25 }} background="UIResource.Icon.Grid_YellowBSD" padding={1}>
        {item === undefined && dragging !== null && isItemType(dragging, ItemType.Crop) && (
          <DropZone
            onDrop={(uid: string) => toServer('petSetFood', { uid, location: ItemLocation.Pet + idx + 1 })}
            location={ItemLocation.Pet + idx + 1}
          />
        )}
        {item && <Item item={item} overridePosition={0} />}
      </JPanel>
    </>
  );
}

function SkillRow({ y, unlocked = 0, skills = [] }: { y: number; unlocked?: number; skills?: number[] }) {
  return (
    <JPanel size={{ width: 245, height: 48 }} position={{ x: 6, y }} background="UIResource.Common.BigBG5">
      {[0, 1, 2, 3, 4, 5].map((v, idx) => (
        <JPanel key={idx} position={{ x: 35 + idx * 35, y: 0 }}>
          {idx < skills.length ? <Skill id={skills[idx]} /> : idx < unlocked ? <SkillEmpty /> : <SkillNotUnlocked />}
        </JPanel>
      ))}
    </JPanel>
  );
}

function Skill({ id }: { id: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showContextMenu, setShowContextMenu] = useState<Position | null>(null);
  const { item: pet } = useContext(ItemContext);
  const isLocked = !!pet && (pet.props?.skills.locks ?? []).includes(id);

  return (
    <>
      <div ref={ref} onMouseLeave={() => setShowContextMenu(null)}>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 5 }} background={'UIResource.Icon.Grid_YellowBSD'}>
          <SkillIcon
            id={id}
            style={{ marginLeft: 1, marginTop: 1, cursor: 'pointer' }}
            hideHover={showContextMenu !== null}
            onClick={(e) => {
              if (!e) {
                return;
              }

              e.stopPropagation();
              e.preventDefault();
              const bbox = ref.current?.getBoundingClientRect() ?? {
                x: e?.pageX ?? 0,
                y: e?.pageY ?? 0,
                width: 0,
              };
              setShowContextMenu({ x: bbox.x + 24, y: bbox.y });
            }}
          />
        </JPanel>

        {isLocked && (
          <JPanel position={{ x: 12, y: 4 }} style={{ fontSize: 12, userSelect: 'none', pointerEvents: 'none' }}>
            🔒
          </JPanel>
        )}

        {showContextMenu && (
          <ContextMenu position={showContextMenu} style={{ width: 100 }}>
            {!isLocked && (
              <ContextMenu.Item
                onClick={() =>
                  prompt(
                    `Are you sure you want to spend ${
                      (pet?.props?.skills.locks ?? []).length < 1 ? 1 : 2
                    } Pet Lock Skill to lock this skill.`,
                    () => toServer('petLockSkill', id)
                  )
                }
                title="Lock"
              />
            )}
            {isLocked && (
              <ContextMenu.Item
                onClick={() => prompt('Are you sure you want to unlock this skill?', () => toServer('petUnlockSkill', id))}
                title="Unlock"
              />
            )}
          </ContextMenu>
        )}
      </div>

      <JPanel size={{ width: 26, height: 12 }} position={{ x: 0, y: 33 }} background="UIResource.SkillTree.TextBG" />
    </>
  );
}

function SkillEmpty() {
  return (
    <>
      <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 5 }} background={'UIResource.Icon.Grid_YellowBSD'} />
      <JPanel size={{ width: 26, height: 12 }} position={{ x: 0, y: 33 }} background="UIResource.SkillTree.TextBG" />
    </>
  );
}

function SkillNotUnlocked() {
  return (
    <>
      <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 5 }} background={'UIResource.SkillTree.Lock4'}></JPanel>
      <JPanel size={{ width: 26, height: 12 }} position={{ x: 0, y: 33 }} background="UIResource.SkillTree.TextBG" />
    </>
  );
}
