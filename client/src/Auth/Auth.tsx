import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/Auth.scss';

const Auth = () => {
  const [IntraID, setIntraID] = useState('');
  const [AuthCode, setAuthCode] = useState('');
  const [WrongCode, setWrongCode] = useState(false);

  useEffect(() => {
    const url = window.location.href.split('?');
    if (url[1]) {
      const intra_id = url[1].split('=');
      if (intra_id[0] === 'intra_id') {
        setIntraID(intra_id[1]);
        sessionStorage.setItem('intraID', intra_id[1]);
        sessionStorage.setItem('2auth', 'false');
      }
    }
  });

  const handleAuthCodeChange = (e: any) => {
    setAuthCode(e.target.value);
  };

  const authCheck = async () => {
    const res = await axios.post('/log/2-factor-auth', {
      intra_id: IntraID,
      auth_value: AuthCode,
    });

    if (res.data.auth_result) {
      sessionStorage.setItem('2auth', 'true');
      if (res.data.id) {
        sessionStorage.setItem('nickname', res.data.id);
        document.location.href = '/lobby';
      } else document.location.href = '/admin';
    } else {
      setWrongCode(true);
    }
  };

  return (
    <div className="auth-box">
      <div className="auth-comment">
        {IntraID}@student.42seoul.kr로 메일이 발송되었습니다.
      </div>
      <div>
        <input
          placeholder="인증 코드를 입력해주세요"
          onChange={handleAuthCodeChange}
        />
        <button onClick={authCheck} className="auth-btn">
          확인
        </button>
      </div>
      {WrongCode ? <div className="wrong-code">잘못된 코드입니다.</div> : null}
    </div>
  );
};

export default Auth;
