import React, { useEffect, useState } from 'react';
import JPanel from '../../components/UI/JPanel';
import { getData } from '../../util/fetch';
import { JScrollPane } from '../../components/UI/JScollPane';
import { useAppDispatch } from '../../hooks';
import { setSetting } from '../../slices/settingsSlice';

export function PatchNotes() {
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState<{ [date: string]: string[] }>({});

  useEffect(() => {
    getData(`json/patchNotes.json`).then(setNotes);
    dispatch(setSetting({ firstSet: false }));
  }, []);

  return (
    <JPanel size={{ width: 400, height: 300 }} background="UIResource.Common.BigBG1" padding={5}>
      <JScrollPane size={{ width: 400, height: 295 }} hidden>
        {Object.keys(notes).map((date, idx) => (
          <React.Fragment key={date + '-' + idx}>
            <b>{date}</b>
            <p style={{ whiteSpace: 'pre-wrap' }}>{notes[date].join('\n')}</p>
          </React.Fragment>
        ))}
      </JScrollPane>
    </JPanel>
  );
}
