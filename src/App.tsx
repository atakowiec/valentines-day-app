import {useEffect, useRef, useState} from 'react'
import appStyle from "./index.module.scss"
import heartImage from "./heart.png"
import heartImage1 from "./heart_1.png"
import brokenHeart from "./broken-heart.png"
import danceGif from "./dance1.gif"
import seedrandom from 'seedrandom';

function App() {
    return (
        <div className={appStyle.container}>
            <FallingHearts/>
            <MainContent/>
        </div>
    )
}

function MainContent() {
    const [stage, setStage] = useState(1)
    const [noButtonOffset, setNoButtonOffset] = useState({x: 0, y: 0})
    const throttle = useRef(false)

    function randomizeNoButtonOffset() {
        if (throttle.current) {
            return
        }
        throttle.current = true
        setTimeout(() => {
            throttle.current = false
        }, 200)

        setNoButtonOffset(prevState => {
            const newState = {...prevState}

            while (Math.abs(newState.x - prevState.x) < 150 && Math.abs(newState.y - prevState.y) < 80) {
                newState.x = Math.random() * 600 - 300;
                newState.y = Math.random() * 400 - 300
            }

            return newState
        })
    }

    function nextStage() {
        setStage(stage + 1)
    }

    function stageText() {
        switch (stage) {
            case 1:
                return "Czy..."
            case 2:
                return "Zostaniesz moją walentynką?"
        }
    }

    function noButtonStyle() {
        return {
            transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`
        }
    }

    return (
        <div className={appStyle.mainContentBox}>
            <div className={appStyle.content}>
                {stage < 3 && <>
                    <div className={appStyle.text}>
                        {stageText()}
                    </div>
                    <div className={appStyle.buttons}>
                        <button onClick={nextStage}>
                            {stage === 2 ? "Tak!!!" : "Dalej..."}
                            <img src={heartImage1} alt="heart"/>
                        </button>
                        {stage === 2 &&
                            <button onClick={randomizeNoButtonOffset} className={appStyle.brokenHeart}
                                    onMouseMove={randomizeNoButtonOffset}
                                    style={noButtonStyle()}>
                                Nie :(
                                <img src={brokenHeart} alt="heart"/>
                            </button>
                        }
                    </div>
                </>}
                {
                    stage === 3 &&
                    <>
                        <img src={danceGif} className={appStyle.danceGif} alt="dance"/>
                    </>
                }
            </div>
        </div>)
}

function FallingHearts() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const hearts = Math.floor((window.innerHeight + 100) / 100) * Math.floor((window.innerWidth + 100) / 100)
        setCount(hearts)
    }, [])

    return (
        <div className={appStyle.heartsContainer}>
            {Array.from({length: count}).map((_, i) => <FallingHeart key={i} id={i}/>)}
        </div>
    )
}

function FallingHeart({id}: { id: number }) {
    const [x, setX] = useState(id % (window.innerWidth / 100) * 100 + (Math.random() - 0.5) * 50)
    const [y, setY] = useState(Math.floor(id / (window.innerWidth / 100)) * 100 + (Math.random() - 0.5) * 50 + 100)
    const [size, setSize] = useState(Math.ceil(Math.random() * 3) * 10 + 10)
    const [currentX, setCurrentX] = useState(x)
    const randomRef = useRef(seedrandom("random-" + id).int32() % 150 + 50)

    function fall() {
        setY(y + 1)
        if (y > window.innerHeight) {
            setY(-50 + y - window.innerHeight)
        }

        setCurrentX(x + Math.sin((y + randomRef.current) / 50) * 10)
    }

    useEffect(() => {
        const interval = setInterval(fall, 17)
        return () => clearInterval(interval)
    }, [x, y])

    function getStyle() {
        return {
            left: currentX + "px",
            top: y + "px",
            width: size + "px",
            height: size + "px",
        }
    }

    return (
        <div className={appStyle.heart} style={getStyle()}>
            <img src={heartImage} alt="heart"/>
        </div>
    )
}

export default App
