const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const { fail } = require("assert");
const { decode } = require("querystring");
const authMiddleware = require("./auth");
const config = require("./config");

const connection = mysql.createConnection(config.mysqlconfig);
connection.connect();

setInterval(() => {
    connection.query("SELECT 1 + 1 AS solution");
}, 100000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "content-type, x-access-token");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello, this is catch-mind server");
});

app.post("/login", (req, res) => {
    const { id, pw } = req.body;
    const secret = config.secret;

    connection.query(
        `select * from user where id = '${id}' and pw = '${pw}'`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "login fail",
                });
            } else {
                if (!rows.length) {
                    res.json({
                        success: false,
                        response: "id or pw is not matched",
                    });
                } else {
                    const token = jwt.sign(
                        {
                            id: id,
                            pw: pw,
                            nickname: rows[0].nickname,
                        },
                        secret,
                        {
                            expiresIn: "7d",
                            issuer: "anyusung.team",
                            subject: "userInfo",
                        }
                    );

                    res.json({
                        success: true,
                        response: "login success",
                        token: token,
                    });
                }
            }
        }
    );
});

app.post("/register", (req, res) => {
    const { id, pw, nickname } = req.body;
    console.log(req.body);

    connection.query("select id, nickname from user", (err, rows, fields) => {
        console.log("1");
        if (err) {
            console.log(err);
            res.json({
                success: false,
                response: "register select error",
            });
        } else {
            console.log("2");
            for (let i in rows) {
                if (rows[i].id === id) {
                    able = false;
                    res.json({ success: false, response: "exist same id" });
                    return;
                }
                if (rows[i].nickname === nickname) {
                    able = false;
                    res.json({
                        success: false,
                        response: "exist same nickname",
                    });
                    return;
                }
            }
            const qureyString = `insert into user values('${id}', '${pw}', '${nickname}', '0', '0')`;

            if (true) {
                connection.query(qureyString, (err, rows, fields) => {
                    console.log("3");
                    if (err) {
                        console.log(err);
                        res.json({
                            success: false,
                            response: "register fail",
                            error: err,
                        });
                    } else {
                        console.log("4");
                        res.json({
                            success: true,
                            response: "register success",
                        });
                    }
                });
            }
        }
    });
});

app.use("/check", authMiddleware);
app.get("/check", (req, res) => {
    res.json({
        success: true,
        info: req.decoded,
    });
});

app.post("/problemsubmit", (req, res) => {
    const { correct, hint, imgdata, author } = req.body;
    correct.replace(/ /g, "");
    if (correct === "") {
        res.json({
            success: false,
            response: "정답을 입력하세요.",
        });
        return;
    }
    let index = 0;
    connection.query("select count(*) from postnew", (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                response: "DB error1",
            });
        } else {
            index = rows[0]["count(*)"] + 1;

            connection.query(
                `insert into postnew (id, correct, hint, imgdata, author) values('${index}', '${correct}', '${hint}', '${imgdata}', '${author}')`,
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        res.json({
                            success: false,
                            response: "다 잘 입력했니?",
                        });
                    } else {
                        res.json({
                            success: true,
                            response: "post success",
                        });
                    }
                }
            );
        }
    });
});

app.get("/post", (req, res) => {
    connection.query(
        "select id, hint, imgdata, author from postnew",
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "문제를 불러오는데 실패했습니다.",
                });
            } else {
                res.json({
                    success: true,
                    response: rows,
                });
            }
        }
    );
});

app.get("/post/:id", (req, res) => {
    connection.query(
        `select id, hint, imgdata, author from postnew where id = '${req.params.id}'`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "cannot fetch data",
                });
            } else {
                res.json({
                    success: true,
                    response: rows[0],
                });
            }
        }
    );
});

function alreadySolved(arr, target) {
    for (let i in arr) {
        if (arr[i].postid == target) {
            return true;
        }
    }
    return false;
}

app.post("/checkcorrect/:id", (req, res) => {
    const { id } = req.params;
    const { input, userid } = req.body;
    input.replace(/ /g, "");
    connection.query(
        `select correct from postnew where id= '${id}'`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "DB error",
                });
            } else {
                if (input === rows[0].correct) {
                    connection.query(
                        `select postid from checksolved where userid = '${userid}'`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.json({
                                    success: false,
                                    response: false,
                                    desc: "정답이지만...",
                                    error: err,
                                });
                            } else {
                                if (!alreadySolved(rows, id)) {
                                    connection.query(
                                        `insert into checksolved (postid, userid) values ('${id}', '${userid}')`,
                                        (err, rows, fields) => {
                                            if (err) {
                                                console.log(err);
                                                res.json({
                                                    success: false,
                                                    response: false,
                                                    desc: "정답이지만...",
                                                    error: err,
                                                });
                                                return;
                                            } else {
                                                connection.query(
                                                    `update user set score = score + 10 where id = '${userid}'`,
                                                    (err, rows, fields) => {
                                                        if (err) {
                                                            console.log(err);
                                                            res.json({
                                                                success: false,
                                                                response:
                                                                    "db error",
                                                            });
                                                        } else {
                                                            res.json({
                                                                success: true,
                                                                response: true,
                                                            });
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    res.json({
                                        success: true,
                                        response: false,
                                        desc: "이미 푼 문제입니다.",
                                    });
                                }
                            }
                        }
                    );
                } else {
                    res.json({
                        success: true,
                        response: false,
                    });
                }
            }
        }
    );
});

app.get("/checksolved/:userid", (req, res) => {
    const userid = req.params.userid;
    connection.query(
        `select postid from checksolved where userid = '${userid}'`,
        (err, rows, fields) => {
            if (err) {
                res.json({
                    success: false,
                    response: "DB error (get checksoveld table)",
                });
            } else {
                res.json({
                    success: true,
                    response: rows,
                });
            }
        }
    );
});

app.get("/score/:user", (req, res) => {
    connection.query(
        `select score from user where id = '${req.params.user}'`,
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "db error",
                });
            } else {
                res.json({
                    success: true,
                    response: rows[0].score,
                });
            }
        }
    );
});

app.get("/postranking", (req, res) => {
    connection.query(
        "select nickname, postnum from user where not postnum = 0 order by postnum desc",
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "랭킹을 불러오는데 실패했습니다",
                });
            } else {
                res.json({
                    success: true,
                    response: rows,
                });
            }
        }
    );
});

app.get("/scoreranking", (req, res) => {
    connection.query(
        "select nickname, score from user where not score = 0 order by score desc",
        (err, rows, fields) => {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    response: "랭킹을 불러오는데 실패했습니다",
                });
            } else {
                res.json({
                    success: true,
                    response: rows,
                });
            }
        }
    );
});

http.listen(8000, () => {
    console.log("listening on *:8000");
});
