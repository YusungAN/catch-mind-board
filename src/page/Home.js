import React, { useState, useEffect } from "react";
import s from "../css/home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import style from "styled-components";

function Home({ history }) {
    const [nickName, setNickName] = useState("");
    const [score, setScore] = useState(0);

    const tokenVerify = async () => {
        const {
            data: {
                success,
                info: { nickname, id },
            },
        } = await axios.get(
            `https://anyusung.team/api/check?token=${localStorage["anyusung-team-token"]}`
        );
        localStorage.setItem("yusungan-userid", id);
        const {data : {response}} = await axios.get(`https://anyusung.team/api/score/${id}`);
        setNickName(nickname);
        setIsLogged(success);
        setScore(response);
        return { success: success, nickname: nickname };
    };

    const logout = () => {
        if (window.confirm("로그아웃하시겠습니까?")) {
            localStorage.clear();
            setIsLogged(false);
            history.push("/");
        }
    };

    const toProblem = async () => {
        try {
            const { success } = await tokenVerify();
            if (success) history.push("/problem");
            else alert("로그인하세요! 아니면 회원가입!");
        } catch (e) {
            alert("로그인하세요! 아니면 회원가입!");
            setIsLogged(false);
        }
    };

    const [isLogged, setIsLogged] = useState();

    useEffect(() => {
        tokenVerify();
    }, []);

    const FlexWrapper = style.div`
        display: flex;
        justify-content: flex-end;
    `;

    const FlexItem = style.div`
        margin-right: 10px;
    `;

    return (
        <>
            <FlexWrapper>
                {!isLogged ? (
                    <>
                        <FlexItem>
                            <Link to="/register">회원가입</Link>
                        </FlexItem>
                        <FlexItem>
                            <Link to="login">로그인</Link>
                        </FlexItem>
                    </>
                ) : (
                    <>
                        <FlexItem>'{nickName}'님 ㅎㅇ ||</FlexItem>
                        <FlexItem>
                            {nickName}님 점수 : {score} ||
                        </FlexItem>
                        <FlexItem>
                            <div onClick={logout}>로그아웃</div>
                        </FlexItem>
                    </>
                )}
            </FlexWrapper>
            <div className={s.sizedbox}></div>
            <div className={s.title}>마음 잡기</div>
            <div className={s.con}>
                <Link to="/post">
                    <button className={s.psolve}>문제 풀기</button>
                </Link>
                <button className={s.pprob} onClick={toProblem}>
                    문제 내기
                </button>
                <Link to="/ranking">
                    <button className={s.pprob}>랭킹 보기</button>
                </Link>
            </div>
        </>
    );
}



export default Home;
