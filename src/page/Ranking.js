import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingBlock from "../components/RankingBlock";
import style from "styled-components";

function Ranking() {
    const [postRanking, setPostRanking] = useState([]);
    const [isContRank, setIsContRank] = useState(true);

    const changeTab = () => {
        if (isContRank === false) {
            setPostRanking(['']);
            getPostRanking('postRanking'); 
            setIsContRank(true); 
        } else {
            setPostRanking(['']);
            setIsContRank(false)
            getPostRanking('scoreRanking');
        }

    }

    const getPostRanking = async (s) => {
        try {
            const {
                data: { success, response },
            } = await axios.get(`https://anyusung.team/api/${s}`);
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
        getPostRanking('postRanking');
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

    const RowWrapper = style.div`
        display: flex;
        flex-direction: row;
        align-items: center;
    `;

    return (
        <Wrapper>
            <RowWrapper>
                <button onClick={changeTab}>
                    {isContRank ? '정답 랭킹 보기' : '문제 출제 랭킹 보기'}
                </button>
            </RowWrapper>
            {isContRank ? (
                <Text>사이트의 일등공신들</Text>
            ) : (
                <Text>정답 많이 맞춘 사람</Text>
            )}
            {postRanking.map((item, index) => {
                return (
                    <RankingBlock
                        key={index}
                        color={index}
                        author={item.nickname}
                        num={isContRank ? item.postnum : item.score}
                        nowTab={isContRank}
                    />
                );
            })}
        </Wrapper>
    );
}

export default Ranking;
