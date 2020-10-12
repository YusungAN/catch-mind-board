import React from 'react'
import style from 'styled-components';

function RankingBlock({color, author, num}) {

    const colorArr = ['gold', '#c0c0c0', 'brown'];

    const Wrapper = style.div`
        @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
        display: flex;
        flex-direction: column;
        font-family: "Do Hyeon", sans-serif;
        text-align: center;
    `;

    const UpperItem = style.div`
        width: ${color <= 2 ? '800px' : '500px'};
        height: ${color <= 2 ? '200px' : '120px'};
        background-color: ${color <= 2 ? colorArr[color] : 'cyan'};
        line-height: ${color <= 2 ? '200px' : '120px'};
        font-size: ${color <= 2 ? '70px' : '40px'};
        overflow: auto;
    `;

    const BelowItem = style.div`
        width: ${color <= 2 ? '800px' : '500px'};
        height: ${color <= 2 ? '200px' : '120px'};
        line-height: ${color <= 2 ? '200px' : '120px'};
        font-size: ${color <= 2 ? '60px' : '35px'};
    `;

    return (
        <Wrapper>
            <UpperItem>{color+1}등 | {author}</UpperItem>
            <BelowItem>제출한 문제: {num}개</BelowItem>
        </Wrapper>
    );
}

export default RankingBlock;