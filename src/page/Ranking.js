import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingBlock from "../components/RankingBlock";
import style from 'styled-components';

function Ranking() {
    const [postRanking, setPostRanking] = useState([]);

    const getPostRanking = async () => {
        try {
            const {
                data: { success, response },
            } = await axios.get("https://anyusung.team/api/postranking");
            if (success) {
                setPostRanking(response);
                //console.log(response);
            } else {
                setPostRanking(["랭킹을 불러오는데 실패했습니다."]);
            }
        } catch (e) {
            setPostRanking(["랭킹을 불러오는데 실패했습니다."]);
        }
    };

    useEffect(() => {
        getPostRanking();
    }, []);

    const Text = style.div`
        font-size: 7rem;
        font-family: "Do Hyeon", sans-serif;
        text-align: center;
        margin-bottom: 50px;
    `;

    const Wrapper = style.div`
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    return (
        <Wrapper>
            <Text>사이트의 일등공신들</Text>
            {postRanking.map((item, index) => {
                return (
                    <RankingBlock
                        key={index}
                        color={index}
                        author={item.nickname}
                        num={item.postnum}
                    />
                );
            })}
        </Wrapper>
    );
}

export default Ranking;
