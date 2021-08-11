import React, { useState, useCallback } from 'react';
import './styles/Modal.scss';

const MatchFailedModal = (props: any) => {
  const { open, close } = props;

  return (
    <div className={open ? 'openModal Modal' : 'Modal'}>
      {open ? (
        <section>
          <header>
            Notice
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <>
            {' '}
            <main>
              <b>Match failed!</b>
            </main>
          </>
        </section>
      ) : null}
    </div>
  );
};
export default MatchFailedModal;
