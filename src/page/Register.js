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

    const enterKey = (e) => {
        if (e.key === 'Enter') {
            sendData();
        }
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

    const Text = style.div`
        @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
        font-family: "Do Hyeon", sans-serif;
        font-size: 5rem;

    `;

    return (
        <>
            <div className={s.flexwrapper}>
                <Text>회원 가입</Text>
                <input type="text" name="id" placeholder="사용할 id 입력" className={s.input} value={id} onChange={handleInput} autoFocus />
                <input type="password" name="pw" className={s.input} placeholder="사용할 비밀번호, 대충 지으세요" value={pw} onChange={handleInput} />
                <input type="text" name="nickname" placeholder="사용할 닉네임 입력" className={s.input} value={nickName} onChange={handleInput} onKeyPress={enterKey} />
                <input type="submit" name="submit" value="회원가입" className={s.submit} onClick={sendData} />
            </div>
        </>
    );
}

export default Register;