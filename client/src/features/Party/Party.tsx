import * as React from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import { Prompt } from '../../components/Prompt/Prompt';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setParty } from '../../slices/partySlice';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

export function Party() {
  const dispatch = useAppDispatch();

  const bounds = useAppSelector((store) => store.ui.bounds);
  const partyId = useAppSelector((store) => store.party.id);
  const party = useAppSelector((store) => store.party.party);

  const [message, setMessage] = React.useState('');
  const [partyInviteId, setPartyInviteId] = React.useState('');

  React.useEffect(() => {
    fromServer('partyInvite', (message, partyId) => {
      setMessage(message);
      setPartyInviteId(partyId);
    });
    fromServer('partyClear', () => dispatch(setParty(null)));

    return () => {
      cancelFromServer('partyInvite');
      cancelFromServer('partyClear');
    };
  }, []);

  React.useEffect(() => {
    if (partyId !== undefined) {
      toServer('partyInfo', (party: any) => {
        dispatch(setParty(party));
      });
    }
  }, [partyId]);

  return (
    <>
      {partyInviteId !== '' && (
        <Prompt
          message={message}
          onAccept={() => {
            toServer('partyAccept', partyInviteId);
            setPartyInviteId('');
          }}
          onReject={() => setPartyInviteId('')}
        />
      )}
      {party === undefined ? null : (
        <div style={{ position: 'absolute', top: bounds[3] / 2, left: 5, transform: 'translateY(-50%)' }}>
          <div style={{ display: 'grid', gridAutoRows: '1fr 1fr' }}>
            {party.positions.map((id, idx) => (
              <PartySlot
                key={idx}
                idx={idx}
                avatar={party.players[id]?.avatar}
                index={idx}
                level={party.players[id]?.level}
                name={party.players[id]?.displayName}
                id={id}
                leaderName={party.leader}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

interface PartySlotProps {
  avatar: number;
  idx: number;
  index: number;
  leaderName: number;
  level: number;
  id: number;
  name: string;
}

function PartySlot({ avatar, idx, index, leaderName, level, name, id }: PartySlotProps) {
  const myDisplayName = useAppSelector((store) => store.character.displayName);
  const myId = useAppSelector((store) => store.account.id);
  const myServerId = useAppSelector((store) => store.account.serverId);

  const iAmLeader = myId === leaderName;

  const onLeave = React.useCallback(() => {
    if (myDisplayName === name) {
      toServer('partyLeave');
    } else {
      if (iAmLeader) {
        toServer('partyKick', idx);
      }
    }
  }, [name, idx]);

  return (
    <div style={{ position: 'relative', marginBottom: 5 }}>
      <CDNImage src="ui/Party/bg.png" style={{ position: 'relative', top: 0, left: 0 }} />
      <CDNImage
        src={`poses/${avatar}.png`}
        style={{
          height: 45,
          position: 'absolute',
          top: 0,
          left: 10,
          WebkitMaskImage: `url(${process.env.REACT_APP_CDN_PATH}ui/Party/mask.png)`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: '-7px 3px',
        }}
      />
      {leaderName === id && (
        <CDNImage src="ui/Party/leader.png" style={{ position: 'absolute', left: 13, top: 0, transform: 'translateY(-100%)' }} />
      )}

      <div
        className="text-shadow"
        style={{
          position: 'absolute',
          left: -15,
          top: -1,
          width: '100%',
          textAlign: 'center',
          fontSize: 12,
          userSelect: 'none',
          color: 'whitesmoke',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.preventDefault();
          toServer('viewCharacter', { serverId: myServerId, accountId: id });
        }}>
        {name}
      </div>

      <ImageButton defaultImage="ui/Party/refresh.png" onClick={() => {}} style={{ position: 'absolute', left: 154, top: 1 }} />

      {(name === myDisplayName || iAmLeader) && (
        <ImageButton defaultImage="ui/Party/close.png" onClick={onLeave} style={{ position: 'absolute', left: 167, top: 1 }} />
      )}

      {index > 0 && iAmLeader && (
        <ImageButton
          defaultImage="ui/Party/arrow.png"
          onClick={() => toServer('partyOrder', { slot: index, modifier: -1 })}
          style={{ position: 'absolute', left: 162, top: 20 }}
        />
      )}

      {index < 2 && iAmLeader && (
        <ImageButton
          defaultImage="ui/Party/arrow.png"
          onClick={() => toServer('partyOrder', { slot: index, modifier: 1 })}
          style={{ position: 'absolute', left: 162, top: 33, transform: 'scaleY(-1)' }}
        />
      )}

      <div style={{ position: 'absolute', left: 3, top: 43, transform: 'translateY(-50%)' }}>
        <CDNImage src="ui/Party/level.png" style={{ width: '38px' }} />
        <div
          className="text-shadow"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: 12,
            userSelect: 'none',
            color: 'whitesmoke',
          }}>
          {level}
        </div>
      </div>
    </div>
  );
}
