import * as React from 'react';

import ImageButton from '../../components/Buttons/ImageButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setChatSize } from '../../slices/uiSlice';

export function ChatSize() {
  const dispatch = useAppDispatch();

  const chatSize = useAppSelector((state) => state.ui.chatSize);

  return (
    <>
      <ImageButton
        defaultImage="features/chat/77.png"
        onClick={() => dispatch(setChatSize(chatSize + 1))}
        style={{ position: 'absolute', left: 0 }}
        imageStyle={{ transform: 'translateY(-100%)' }}
        disabled={chatSize === 3}
      />
      <ImageButton
        defaultImage="features/chat/82.png"
        onClick={() => dispatch(setChatSize(chatSize - 1))}
        style={{ position: 'absolute', left: 22 }}
        imageStyle={{ transform: 'translateY(-100%)' }}
        disabled={chatSize === 0}
      />
    </>
  );
}
