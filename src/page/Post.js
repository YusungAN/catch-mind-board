import React, { useState, useEffect } from "react";
import style from "styled-components";
import axios from "axios";
import PostBox from "../components/PostBox";
import PopUp from '../components/PopUp';

function Post() {
    const getPosts = async () => {
        const {
            data: { success, response },
        } = await axios.get("https://anyusung.team/api/post");
        if (success) {
            await setPosts(response);
            setIsLoading(false);
            return response;
        } else {
            setPosts('문제를 올리는데 실패했습니다.');
        }
    };

    const [posts, setPosts] = useState([1, 2, 3]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(false);
    const [popUpOpened, setPopUpOpened] = useState(false);

    const openPopUp = async (id) => {
        console.log('dd');
        setPopUpOpened(true);
        const {data: {success, response}} = await axios.get(`https://anyusung.team/api/post/${id}`);
        if (!success) {
            setSelectedPost('문제를 불러오는데 실패했습니다.');
        } else {
            setSelectedPost(response);
        }
    }

    const closePopUp = () => {
        setPopUpOpened(false);
        setSelectedPost(false);
    }

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            <Text>재밌는 그림들^^</Text>
            <FlexContainer>
                { isLoading ? "로딩중..." 
                : posts.map((item, index) => <PostBox key={index} id={item.id} imgdata={item.imgdata} author={item.author} open={openPopUp} />)}
                <PopUp display={popUpOpened} close={closePopUp} data={selectedPost} />
            </FlexContainer>
        </>
    );
}

const Text = style.div`
    @import url("https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap");
    font-family: "Do Hyeon", sans-serif;
    font-size: 5rem;
    text-align: center;
    margin-top: 30px;
`;

const FlexContainer = style.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
    flex-wrap: wrap;
`;

export default Post;
