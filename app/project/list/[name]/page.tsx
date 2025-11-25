import React from 'react'


const page = async({params}:{params:{name:string}}) => {
  const {name} = await params;

  return (
    <div>

        <h1> Thi is an dynamic route in nextjs </h1>
        {name}
        
    </div>
  )
}

export default page