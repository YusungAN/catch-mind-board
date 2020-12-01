import React, { useState, useRef } from "react";
import Canvas from "../components/Canvas";
import s from "../css/problem.module.css";
import axios from "axios";

function Problem({ history }) {
    const childRef = useRef();
    const [is, setIs] = useState(false);

    const [correct, setCorrect] = useState("");
    const [hint, setHint] = useState("");
    const [picture, setPicture] = useState("");

    const tokenVerify = async () => {
        const {
            data: {
                success,
                info: { nickname },
            },
        } = await axios.get(
            `https://anyusung.team/api/check?token=${localStorage["anyusung-team-token"]}`
        );
        //setNickName(nickname);
        console.log(success, nickname);
        return { isLogged: success, nickname: nickname };
    };

    const sendData = async () => {
        console.log(picture);
        try {
            const { isLogged, nickname } = await tokenVerify();
            if (isLogged) {
                const {
                    data: { success, response },
                } = await axios.post("https://anyusung.team/api/problemsubmit", {
                    correct: correct,
                    hint: hint,
                    imgdata: picture,
                    author: nickname,
                });
                console.log(success, response);

                if (!success) {
                    alert(
                        `캐치마인드 문제 올리기 실패! 다시 시도해보세요.\n이유: ${response}`
                    );
                } else {
                    alert("문제 올리기 성공!");
                    history.push("/");
                }
            } else {
                alert("로그인 풀린거 같은데");
                history.push("/");
            }
        } catch (e) {
            alert("로그인 풀린거 같은데");
            history.push("/");
        }
    };

    const handleCorInput = async (e) => {
        if (!is) {
            childRef.current.savePicture();
            setIs(true);
        }
        const {
            target: { value },
        } = e;
        setCorrect(value);
    };

    const handleHintInput = (e) => {
        if (!is) {
            childRef.current.savePicture();
            setIs(true);
        }
        const {
            target: { value },
        } = e;
        setHint(value);
    };

    const pictureAddress = async (address) => {
        await setPicture(address);
    };

    return (
        <>
            <div className={s.title}>당신의 창의력을 표현하세요</div>
            <div className={s.con}>
                <div>
                    *너무 빠르게 그리면 뻗을 수 있으니 주의! (개발자 역량 부족)
                </div>
                <Canvas onChange={pictureAddress} onDraw={() => {setIs(false)}} ref={childRef} />
                <input
                    type="text"
                    name="correct"
                    placeholder="정답 입력"
                    className={s.input1}
                    value={correct}
                    onChange={handleCorInput}
                />
                <input
                    type="text"
                    name="hint1"
                    placeholder="힌트 입력"
                    className={s.input2}
                    value={hint}
                    onChange={handleHintInput}
                />
                <input
                    type="submit"
                    value="문제 내기"
                    className={s.submit}
                    onClick={sendData}
                />
            </div>
        </>
    );
}

export default Problem;
