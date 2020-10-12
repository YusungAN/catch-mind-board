import React, { useState } from 'react';
import style from 'styled-components';
import s from '../css/register.module.css';
import axios from 'axios';

function Register({history}) {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [nickName, setNickName] = useState('');

    const handleInput = (e) => {
        const {
            target : { name }
        } = e;
        const {
            target: { value }
        } = e;
        if (name === 'id') setId(value);
        else if (name === 'pw') setPw(value);
        else if (name === 'nickname') setNickName(value);
        
    }

    const sendData = async () => {
        console.log('dd');
        try {
            const {data: {
                success, response
            }} = await axios.post('https://anyusung.team/api/register', {
                id: id,
                pw: pw,
                nickname: nickName
            });
            console.log(success, response);
            if (!success) {
                alert(`회원가입 실패!\n이유 : ${response}`);
                return;
            } else {
                alert('회원가입 성공!');
                history.push('/');
            }
        } catch (e) {
            alert(`회원가입 실패!\n이유 : 서버 꺼짐?`);

        }
        
    }

    return (
        <>
            <div className={s.flexwrapper}>
                <Text>회원 가입</Text>
                <input type="text" name="id" placeholder="사용할 id 입력" className={s.input} value={id} onChange={handleInput} />
                <input type="password" name="pw" className={s.input} placeholder="사용할 비밀번호" value={pw} onChange={handleInput} />
                <input type="text" name="nickname" placeholder="사용할 닉네임 입력" className={s.input} value={nickName} onChange={handleInput} />
                <WarningText>*DB에 비번 평문으로 저장됨. 그러니 비밀번호 대충 안 쓰는 걸로 지을 것.</WarningText>
                <input type="submit" name="submit" value="회원가입" className={s.submit} onClick={sendData} />
            </div>
        </>
    );
}

const Text = style.div`
        @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
        font-family: "Do Hyeon", sans-serif;
        font-size: 5rem;

    `;

const WarningText = style.div`
    @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
    font-family: "Do Hyeon", sans-serif;
    font-size: 2rem;
    color: red;
    margin-top: 50px;
`;

export default Register;