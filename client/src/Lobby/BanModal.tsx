import React, { useEffect, useState, useCallback } from 'react';
import "../SideBar/styles/UserInfoModal.scss";

const BanModal = ( props: any) => {
	const { open, close} = props;

	return (
		<div className={ open ? 'openModal Modal' : 'Modal' }>
			{ open ? (
				<section>
					<div className="head">
						<button className="close" onClick={close}> &times; </button>
					</div>
					<div className="content">
						<div className="header">
							<hr/>
							<div className="name lose-color">채팅방에 입장할 수 없습니다.</div>
							<hr/>
						</div>
					</div>
				</section>
			) : null }
		</div>
	)
}

export default BanModal