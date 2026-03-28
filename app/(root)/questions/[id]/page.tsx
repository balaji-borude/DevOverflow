const QuestionDetails = async({params}:RouteParams) => {
    //   He Params ahe 
    const {id} = await params; // question id ghenasathi use hote
  return (
    <div>  QuestionDetails page {id}</div>
  )
}

export default QuestionDetails
