import React, { createRef, useEffect, useState } from "react";
import s from "./canvas.module.css";
import style from "styled-components";
import img from "../../assets/eraser.png";

function Canvas({ onChange }) {
    let canvas, ctx;
    const canvasRef = createRef();

    let pos = {
        drawable: false,
        x: 0,
        y: 0,
    };

    const [colorCopArr, setColorCopArr] = useState([
        { color: "red", clicked: false },
        { color: "blue", clicked: false },
        { color: "green", clicked: false },
        { color: "yellow", clicked: false },
        { color: "black", clicked: false },
    ]);
    const [nowColor, setNowColor] = useState("");
    const [nowCanvas, setNowCanvas] = useState("");
    const [erase, setErase] = useState(false);

    const selectColor = async (color) => {
        let temp = colorCopArr.slice();
        let index;

        for (let i in temp) {
            if (temp[i].color === color) index = i;
        }
        for (let i in temp) {
            temp[i].clicked = false;
        }
        temp[index].clicked = true;
        await setNowCanvas(canvas.toDataURL());
        setErase(false);
        setColorCopArr(temp);
        setNowColor(color);
    };

    const colorCopComponents = colorCopArr.map((item, index) => {
        return (
            <div
                className={s.colorcop}
                style={{
                    backgroundColor: item.color,
                    border: item.clicked ? "2px solid black" : "none",
                }}
                key={index}
                onClick={() => selectColor(item.color)}
            />
        );
    });

    const getPosition = (e) => {
        return {
            x: e.offsetX,
            y: e.offsetY,
        };
    };

    const initDraw = (e) => {
        ctx.beginPath();
        pos = { drawable: true, ...getPosition(e) };
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (pos.drawable) {
            pos = { ...pos, ...getPosition(e) };
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    };

    const finishDraw = async () => {
        pos = { drawable: false, x: 0, y: 0 };
        // setTimeout(() => {
        //     setNowCanvas(canvas.toDataURL());
        // }, 100);
    };

    const selectEraser = async () => {
        await setNowCanvas(canvas.toDataURL());
        setErase(!erase);
        setNowColor("white");
    };

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = nowColor;
        ctx.lineWidth = erase ? 10 : 1;
        canvas.addEventListener("mousedown", initDraw);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", finishDraw);
        canvas.addEventListener("mouseout", finishDraw);
        onChange(nowCanvas);
        const image = new Image();
        image.src = nowCanvas;
        ctx.drawImage(image, 0, 0);
    });

    const EraserBtn = style.img`
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: ${erase ? "2px solid black" : "none"};
        margin-bottom: 5px;
        box-shadow: -2px 2px 3px 2px rgba(0, 0, 0, 0.4);
        clip-path: circle(30px at center);
    `;

    const FlexColumnWrapper = style.div`
        display: flex;
        flex-direction: column;
        margin: 5px;
    `;

    const FlexRowWrapper = style.div`
        display: flex;
        flex-direction: Row;
    `;

    return (
        <FlexRowWrapper>
            <FlexColumnWrapper>
                <EraserBtn src={img} alt="지우개" onClick={selectEraser} />
            </FlexColumnWrapper>
            <canvas
                ref={canvasRef}
                width="400"
                height="400"
                className={s.canvas}
            ></canvas>
            <FlexColumnWrapper>{colorCopComponents}</FlexColumnWrapper>
        </FlexRowWrapper>
    );
}

export default Canvas;
