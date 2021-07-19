import React from 'react';
import "./styles/MakeRoomModal.css";

const PwRoomModal = ( props: any ) => {
    const { open, close, header, enterRoom } = props;

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
						<a className="btn btn-dark" onClick={enterRoom}><b>확인</b></a>
                    </footer>
                </section>
            ) : null }
        </div>
    )
}

export default PwRoomModal