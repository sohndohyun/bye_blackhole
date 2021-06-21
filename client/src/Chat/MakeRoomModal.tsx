import React from 'react';
import "./styles/MakeRoomModal.css";

const MakeRoomModal = ( props: any ) => {
    const { open, close, header, makeRoom } = props;

    return (
        <div className={ open ? 'openMakeRoomModal MakeRoomModal' : 'MakeRoomModal' }>
            { open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={close}> &times; </button>
                    </header>
                    <main>
                        {props.children}
                    </main>
                    <footer>
						<a className="btn btn-primary" href="/Chat" onClick={makeRoom}><b>방 만들기</b></a>
                    </footer>
                </section>
            ) : null }
        </div>
    )
}

export default MakeRoomModal