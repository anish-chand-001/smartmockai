import React from 'react'
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const Timer = ({TimerLeft , TotalTime}) => {
    const percentage =  (TimerLeft/ TotalTime)*100
  return (
    <div className='w-20 h-20 '>
        <CircularProgressbar 
        value={percentage} 
        text={`${TimerLeft}s`}
        styles={buildStyles({
            textSize:"28px",
            pathColor:"#10b981",
            textColor:"#ef4444",
            trailColor:"e5e7eb"
        })}
        />
    </div>
  )
}

export default Timer