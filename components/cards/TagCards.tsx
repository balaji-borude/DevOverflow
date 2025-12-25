import React from 'react'
import Link from 'next/link';
import ROUTES from '@/constants/route';
import { Badge } from '../ui/badge';
import { getDeviconClassName } from '@/lib/utils';


interface Props{
  _id:string,
  name:string,
  questions:number,
  showcount?:boolean,
  compact?:boolean
}
const TagCards = ({_id,name,questions,showcount,compact}:Props) => {

const iconClass = getDeviconClassName(name);


  return <Link href={ROUTES.TAG(_id)} className='flex justify-between gap-2 '>
    <Badge className='background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>
      <div className='flex-center space-x-2'>
        <i className={`${iconClass} text-sm`}></i>
        <span> {name}</span>
      </div>
    </Badge>

    {/* count */}
    {
      showcount && <p className='small-medium text-dark500_light700'> {questions}</p>
    }
  </Link>
}

export default TagCards