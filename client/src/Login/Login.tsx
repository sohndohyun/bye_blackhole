import React, { useEffect, useState } from "react";

const Login = () => {
	const [IntraID, setIntraID] = useState('')

	const handleIntraIDChange = (e:any) => {
		setIntraID(e.target.value);
	};

	return (
		<div>
			<input onChange={handleIntraIDChange}></input>
			<button onClick= {() => {
				document.location.href = "/Admin"
				sessionStorage.setItem('intraID', IntraID)
			}}>Login</button>
		</div>
	)
}
export default Login