import React from 'react';
import "./styles/Modal.scss";

const ChatListModal = ( props: any ) => {
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
						<a className="btn btn-primary" href="/Chat" onClick={makeRoom}><b>Enter</b></a>
                    </footer>
                </section>
            ) : null }
        </div>
    )
}

export default ChatListModal