import React from "react";
import { Route } from "react-router-dom";
import { Home, Problem, Register, Login, Post, Ranking } from "./page";

const App = () => {
    return (
        <>
            <Route exact path={"/"} component={Home} />
            <Route path={"/problem"} component={Problem} />
            <Route path={"/register"} component={Register} />
            <Route path={"/login"} component={Login} />
            <Route path={"/post"} component={Post} />
            <Route path={"/ranking"} component={Ranking} />
        </>
    );
};

export default App;
