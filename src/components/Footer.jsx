import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col justify-center items-center fixed bottom-0 w-full'>
    <div className='logo font-bold text-white text-2xl'>
    <span className='text-green-700'> &lt;</span>
   
    <span>Dozz</span><span className='text-green-700'>Password/ &gt;</span>
    
    </div>
    <div className='flex'>
        Created with 
        <img className='w-7 mx-2' src='icons/cancer.jpeg' alt='' />
        by RAJAT KUMAR
    </div>
    </div>
  )
}

export default Footer