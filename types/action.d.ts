

interface SigninWithOAuthParams{
    provider:'github' | 'google',
    providerAccountId:string,
    user:{
        email:string,
        name:string,
        image:string,
        username:string,
    }
};

interface AuthCredentials{
    name:string,
    username:string,
    email:string,
    password:string,
};

// create question action
interface CreateQuestionParams{
    title: string;
    content: string;
    tags: string[];
};

interface RouteParams{
    params:Promise<Record<string, string>>; //swfinw object structe
    searchParams:Promise<Record<string, string>>;
};

// params: /question/:id => yat actual value of id jt ghene asel tr use hote 
//searchParams: /question/:id ? tag=react => yat Question mark nanter che value ghenasathi use hote te Key : value  pair mahde aste 