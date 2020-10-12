import React, { useState } from "react";
import axios from "axios";
import style from "styled-components";
import s from "../css/register.module.css";

function Login({ history }) {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const handleInput = (e) => {
        const {
            target: { name },
        } = e;
        const {
            target: { value },
        } = e;
        if (name === "id") setId(value);
        else if (name === "pw") setPw(value);
    };

    const sendData = async () => {
        console.log("dd");
        try {
            const {
                data: { success, response, token },
            } = await axios.post("https://anyusung.team/api/login", {
                id: id,
                pw: pw,
            });
            console.log(success, response);
            if (!success) {
                alert(`로그인 실패!\n이유 : ${response}`);
                return;
            } else {
                localStorage.setItem("anyusung-team-token", token);
                alert("로그인 성공!");
                history.push("/");
            }
        } catch (e) {
            alert(`로그인 실패!\n이유 : 서버 꺼짐?`);
        }
        
    };

    return (
        <>
            <div className={s.flexwrapper}>
                <Text>로그인</Text>
                <input
                    type="text"
                    name="id"
                    placeholder="id"
                    className={s.input}
                    value={id}
                    onChange={handleInput}
                />
                <input
                    type="password"
                    name="pw"
                    className={s.input}
                    placeholder="비밀번호"
                    value={pw}
                    onChange={handleInput}
                />
                <input
                    type="submit"
                    name="submit"
                    value="로그인"
                    className={s.submit}
                    style={{ marginTop: 20 }}
                    onClick={sendData}
                />
            </div>
        </>
    );
}

const Text = style.div`
    @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
    font-family: "Do Hyeon", sans-serif;
    font-size: 5rem;
`;

export default Login;
