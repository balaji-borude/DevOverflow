import QuestionForms from '@/components/forms/QuestionForms'
import React from 'react'

const Ask_Question = () => {
  return<div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
     <QuestionForms/>
      </div>
    </div>
}

export default Ask_Question