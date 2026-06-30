import React from 'react'
import { BsRobot } from 'react-icons/bs'

const Footer = () => {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 py-4 pb-10 pt-10 '>
        <div className='w-full mx-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-3 py-8 text-center '>
            <div className='flex justify-center items-center gap-3 mb-3 '>
                    <div className='bg-black text-white p-2 rounded-lg '  >
                        <BsRobot size={16} />
                    </div>
                    <h2 className='font-semibold  '>SmartMock.AI</h2>
            </div>
            <p className='text-gray-500 text-sm  max-w-xl mx-auto'>
                AI powered Interview preparation platform design to improve the communincation skills, 
                technical skills depth and professional confidence
            </p>

        </div>

    </div>
  )
}

export default Footer