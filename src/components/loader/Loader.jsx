import React, { useEffect, useState } from 'react';
import "../loader/loader.scss"

const colors = [
"#F7E7B0","#F4D66D",
"#D8D1C6","#A99C86",
"#A7B9C4","#7B9FB4",
"#9A8D96","#735E6D",
"#E1EBF1","#A9CCE4",
"#D7E0DB","#A8B7AE"
]

const Loader = () => {

  const columns = 12
  const maxBlocks = 8

  const [levels,setLevels] = useState(
    Array.from({length:columns},()=>2)
  )

  const [color,setColor] = useState(colors[0])

  const [dots,setDots] = useState("")

  useEffect(()=>{

    const interval = setInterval(()=>{

      const newLevels =
        Array.from({length:columns},()=>
          Math.floor(Math.random()*maxBlocks)+1
        )

      const randomColor =
        colors[Math.floor(Math.random()*colors.length)]

      setLevels(newLevels)
      setColor(randomColor)

    },180)

    return ()=>clearInterval(interval)

  },[])


  useEffect(()=>{

    const dotInterval = setInterval(()=>{

      setDots(prev => {

        if(prev.length >= 3) return ""
        return prev + "."

      })

    },400)

    return ()=>clearInterval(dotInterval)

  },[])


  return(

    <div className="loader-wrapper">

      <div className="loader">

        {levels.map((level,i)=>(
          <div key={i} className="column">

            {Array.from({length:maxBlocks}).map((_,j)=>(

              <div
                key={j}
                className={`block ${j < level ? "active" : ""}`}
                style={{
                  backgroundColor: j < level ? color : "transparent"
                }}
              />

            ))}

          </div>
        ))}

      </div>

      <div className="loading-text">
        loading{dots}
      </div>

    </div>

  )
}

export default Loader
