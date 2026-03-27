import ROUTES from "./route";

export const  DEFAULT_EMPTY = {
    title:"NO data found",
    message:"Looks like the database is taking a nap. wake it up with some new Entries ",
    button:{
        text:'Add Data',
        href:ROUTES.HOME,
    }
};

export const  DEFAULT_ERROR = {
    title:"Oops! Something went wrong",
    message:"Even our code can have a bad day. give it another shot",
    button:{
        text:'Try Again',
        href:ROUTES.HOME,
    }
};

export const EMPTY_QUESTIONS = {
    title:"Ahh! No Questions Found",
    message:"The question is empty it's waiting for you the waiting for you to fill it",
    button:{
        text:'Ask a Question',
        href:ROUTES.ASK_QUESTION,
    }
};

export const EMPTY_TAGS = {
    title:"No Tags Found",
    message:"The tag is empty it's waiting for you the waiting for you to fill it",
    button:{
        text:'Add a Tag',
        href:ROUTES.TAGS,
    }
};

export const EMPTY_COLLECTION = {
    title:"No Collection Found",
    message:"the Collection is Em pty ! ",
    button:{
        text:'Add a Collection',
        href:ROUTES.COLLECTION,
    }
}

