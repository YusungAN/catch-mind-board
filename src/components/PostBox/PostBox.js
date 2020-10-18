import React from "react";
import style from "styled-components";

function PostBox({ id, imgdata, author, open, color }) {
    const PostBoxElement = style.div`
    width: 200px;
    height: 200px;
    background-color: ${color ? "green" : "grey"};
    border-radius: 30px;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 30px;
    `;

    return (
        <>
            <PostBoxElement onClick={() => open(id)}>
                <div>{id}</div>
                <div
                    style={{
                        width: 145,
                        height: 145,
                        backgroundColor: "white",
                    }}
                >
                    <img
                        src={imgdata}
                        width="145"
                        height="145"
                        alt="그림 준비중"
                    />
                </div>
                <div>출제자: {author}</div>
            </PostBoxElement>
        </>
    );
}

export default PostBox;
