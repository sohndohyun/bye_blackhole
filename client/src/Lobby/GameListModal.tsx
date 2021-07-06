import React from 'react';
import "./styles/Modal.scss";

const GameListModal = ( props: any ) => {
    const { open, close, header, makeRoom } = props;

    return (
        <div className={ open ? 'openModal Modal' : 'Modal' }>
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
						<a className="btn btn-primary" href="/Game" onClick={makeRoom}><b>Matching Start</b></a>
                    </footer>
                </section>
            ) : null }
        </div>
    )
}

export default GameListModal