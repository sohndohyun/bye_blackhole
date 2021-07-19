import React from 'react';
import "./styles/MakeRoomModal.css";

const NoEntryModal = ( props: any ) => {
    const { open, close } = props;

    return (
        <div className={ open ? 'openMakeRoomModal MakeRoomModal' : 'MakeRoomModal' }>
            { open ? (
                <section>
                    <header>
                        <button className="close" onClick={close}> &times; </button>
                    </header>
                    <main>
                        {props.children}
                    </main>
                </section>
            ) : null }
        </div>
    )
}

export default NoEntryModal