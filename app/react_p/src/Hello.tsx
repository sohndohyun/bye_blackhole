import React, {useState} from 'react';

interface myObj
{
	color:any,
	name:any,
	isSpecial:any
}

function Hello({color, name, isSpecial}: myObj) {
  return (
	<div style={{color}}>
	  { isSpecial ? <b>*</b> : null}
	  안녕하세요 {name}
	</div>
  )
}

Hello.defaultProps = {
	name: '이름없음',
	isSpecial: false
}
export default Hello;


export function Wrapper({children}: any) {
	const style = {
		border: '2px solid black',
		padding: '16px'
	};
	return (
		<div style={style}>
		{children}
		</div>
	)
}


export function Counter() {
	const [number, setNumber] = useState(0)
	const onIncrease = () => {
		setNumber(prevNumber => prevNumber + 1)
		console.log('+1')
	}
	const onDecrease = () => {
		setNumber(prevNumber => prevNumber - 1)
		console.log('-1')
	}
	return (
		<div>
			<h1>{number}</h1>
			<button onClick={onIncrease}>+1</button>
			<button onClick={onDecrease}>-1</button>
		</div>
	)
}


export function InputSample()
{
	const [inputs, setInputs] = useState({
		name: '',
		nickname: ''
	})
	const {name, nickname} = inputs
	const onChange = (e:any) => {
		const {value, name} = e.target
		setInputs({
			...inputs,
			[name]: value
		})
	}
	const onReset = () => {
		setInputs({
			name: '',
			nickname: ''
		})
	}

	return (
		<div>
			<input name="name" placeholder="이름" onChange={onChange} value={name} />
			<input name="nickname" placeholder="닉네임" onChange={onChange} value={nickname} />
			<button onClick={onReset}>초기화</button>
			<div>
				<b>값: </b>
				{name} ({nickname})
			</div>
		</div>
	)
}