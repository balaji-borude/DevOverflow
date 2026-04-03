import React from "react";
import { ActionResponse, Answers } from "@/types/global";
import DataRenderer from "../DataRenderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswersCard from "../cards/AnswersCard";

interface Props extends ActionResponse<Answers[]> {
  totalAnswers: number;
}

const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient ">
          {" "}
          {totalAnswers} {totalAnswers == 1 ? "Answer" : "Answers"}{" "}
        </h3>
        <p> Filters</p>
      </div>

        {/* Data render for the showing answers  
        */}

        <DataRenderer data={data}
            error={error}
            success={success}
            empty={EMPTY_ANSWERS}
            render={(answers)=>answers.map((answer,index)=><AnswersCard key={index} {...answer}/>)}
        />
        {/* {...answer} --> THIS give all the details of answers to the asnwerscard componsnets  */}
    </div>
  );
};

export default AllAnswers;
