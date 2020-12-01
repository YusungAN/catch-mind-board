import React, { useState } from "react";
import style from "styled-components";
import axios from "axios";

function PopUp({ display, close, data }) {
    const PopUp = {
        position: "fixed",
        top: "100px",
        left: "50%",
        width: "400px",
        height: "600px",
        backgroundColor: "lightgrey",
        display: display ? "flex" : "none",
        borderRadius: "25px",
        marginLeft: "-200px",
        flexDirection: "column",
        alignItems: "center",
    };

    const Input = {
        width: "300px",
        height: "30px",
        borderRadius: "50px",
        paddingLeft: "10px",
        marginTop: "10px",
    };

    const LightBox = style.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: ${display ? "block" : "none"};
        background: rgba(0, 0, 0, 0.7);
    `;

    const [isCor, setIsCor] = useState("");
    const [correct, setCorrect] = useState("");

    const inputCorrect = (e) => {
        setCorrect(e.target.value);
    };

    const enterKey = (e) => {
        if (e.key === 'Enter') {
            checkCorrect();
        }
    }

    const tokenVerify = async () => {
        const {
            data: {
                success,
                info: { id },
            },
        } = await axios.get(
            `https://anyusung.team/api/check?token=${localStorage["anyusung-team-token"]}`
        );
        return { success: success, id: id };
    }

    const checkCorrect = async () => {
        try {
            setIsCor("엄...");
            const { success: Logged, id } = await tokenVerify();
            console.log(Logged, id);
            if (Logged) {
                const {
                    data: { success, response, desc },
                } = await axios.post(
                    `https://anyusung.team/api/checkcorrect/${data.id}`,
                    { input: correct, userid: id }
                );

                if (success) {
                    if (!response) {
                        if (!desc) {
                            setIsCor("땡!!!!!!!!!!!!!");
                            setTimeout(() => {
                                setIsCor("");
                                setCorrect("");
                            }, 1000);
                        } else {
                            setIsCor(desc);
                            setTimeout(() => {
                                setIsCor("");
                                setCorrect("");
                            }, 1000);
                        }
                    } else {
                        setIsCor("정답...점수 +10");
                        setTimeout(() => {
                            setIsCor("");
                            setCorrect("");
                        }, 1000);
                    }
                } else {
                    setIsCor(desc || "헉..정답 확인이 안돼요..");
                    setTimeout(() => {
                        setIsCor("");
                        setCorrect("");
                    }, 1000);
                }
            } else {
                setIsCor("정답 확인은...로그인하면..");
                setTimeout(() => {
                    setIsCor("");
                    setCorrect("");
                }, 1000);
            }
        } catch (e) {
            console.log(e);
            setIsCor("정답 확인은...로그인하면..");
            setTimeout(() => setIsCor(""), 1000);
        }
    };

    return (
        <>
            <LightBox onClick={close} />
            <div style={PopUp}>
                {data ? (
                    <>
                        <div>{data.id}</div>
                        <div
                            style={{
                                width: 350,
                                height: 350,
                                backgroundColor: "white",
                            }}
                        >
                            <img
                                src={data.imgdata}
                                width="350"
                                height="350"
                                alt="그림 준비중"
                            />
                        </div>
                        <div>힌트: {data.hint}</div>
                        <input
                            type="text"
                            name="correct"
                            style={Input}
                            value={correct}
                            onChange={inputCorrect}
                            placeholder="정답을 입력하세요"
                            onKeyPress={enterKey}
                        />
                        <input
                            type="submit"
                            name="submit"
                            value="정답 확인"
                            onClick={checkCorrect}
                        />
                        <div>{isCor}</div>
                    </>
                ) : (
                    <div>로딩중...</div>
                )}
            </div>
        </>
    );
}

export default PopUp;
