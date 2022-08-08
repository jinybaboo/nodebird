const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path'); //경로처리를 위한 path 가져오기
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');
const logger = require('./logger');  //winston 로그 기록용

// dotenv 설치 및 설명
// npm i dotenv
// 비밀 키들을 소스 코드에 그대로 적어두면 소스 코드가 유출되었을 때 비밀 키도 같이 유출됨
// env 파일에  비밀키, 환경변수 등을  모아두고 .env 파일만 잘 관리하면 됨
dotenv.config();


//포트 및 서버환경 설정
// 서버 app의 속성을 설정한다 (전역적으로 설정이 되며 get일 이용해 앱 전역에서 값을 가져와 쓸 수 있다.)
 //.env에 설정된 기본 포트를 사용하고 없으면 8001번을 사용한다. 개발시에는 8001을 사용하고, 배포시에는 .env에 포트번호를 80(http) 또는 443(https)로 설정 해준다.
const app = express();
app.set('port', process.env.PORT || 8001); 


//넌적스 환경 설정
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app,
    watch:true,
});

//sequelize 생성및 DB 연결
const {sequelize} = require('./models');
sequelize.sync({force : false})  //force:false의 의미 : 노드 module>js 파일에서에서 db테이블을 삭제하거나 수정할수 없게 함.
    .then(()=>{
        logger.info('DB 연결됨')
    })
    .catch((err)=>{
        logger.log(err);
    })




// 설치 미들웨어 morgan 
//설치 : npm i morgan
//dev 대신 combined, common, short, tiny등을 넣을 수 있다. 개발시 dev, 배포시는 combined를 주로 사용한다.			

//개발모드/ 배포모드 환경 설정
if(process.env.NODE_ENV=='production'){
    app.use(morgan('combined'));			
    app.use(helmet({contentSecurityPolicy :false}));
    app.use(hpp());
}else{
    app.use(morgan('dev'));		
}



// 익스프레스 내장 미들웨어 (static)
// 요청경로와 파일의 실제경로를 매핑 해주는 기능이다. 요청경로와 실제경로를 분리함으로서 보안성을 높인다.
// app.use('/요청경로',express.static('/실제경로'));   
// 노드에서 현재 파일명 및 경로명은 항상 키워드로 호출 가능하다
//console.log(__dirname); //console.log(__filename);
app.use('/', express.static(path.join(__dirname, 'public')));    //정적파일(css 등) 경로 설정
app.use('/img', express.static(path.join(__dirname, 'uploads')));    //upload (이미지가 저장되어 있는 폴더)  //와 db에 저장된 경로를 매칭시켜준다 upload => img


// 익스프레스 내장 미들웨어 (bodyParser)
// 폼데이터나 ajax에서 넘어오는 텍스트 데이터를 가져올때 사용한다. 제이슨 형태의 데이터를 간단하게 가져올 수 있다.
// 멀티파트 파일을 가져올때는 사용하지 못한다 (multer 사용해야 함);
// app.get()에서 데이터를 가져올때 간단하게 사용 가능하다.
app.use(express.json());
app.use(express.urlencoded({extended:true})); //겟방식으로 url 뒤에 ?cate=123 같이쿼리스트링 형식의 데이터도 제이슨으로 받아서 간단하게 꺼내쓸수 있게 해준다.

// 설치 미들웨어 cookie-parser  //내부적으로 next() 자동 호출
//설치 : npm i cookie-parser
//간편하게 쿠키를 가져올 수 있다.
app.use(cookieParser(process.env.COOKIE_SECRET));  //쿠키 암호화 함
//app.get() 안에서 쿠키를 생성할수 있다


// 설치 미들웨어 express-session 
//설치 : npm i express-session 
//세션 환경 설정 (전역 환경에서 설정)

const sessionOption ={
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET, //세션 암호화 함
    cookie:{
        httpOnly:true,
        secure:false,
    },
}

//배포환경일때 세션 설정
if(process.env.NODE_ENV=='production'){
    sessionOption.proxy = true;
    //sessionOption.cookie.secure = true;  //https 적용시 true 처리 해줌!
}
app.use(session(sessionOption));


// 분리된 라우터 가져오기
const pageRouter = require('./routers/page');
app.use('/', pageRouter);


const authRouter = require('./routers/auth');
app.use('/auth', authRouter);

const postRouter = require('./routers/post');
app.use('/post', postRouter);



// 404 처리하기용 미들웨어
//모든 라우터 아래, 에러처리 미들웨어 라우터 위에 위치해 준다. (위쪽 라우터에 하나도 안걸렸을경우는 무조건 404이기 때문.)
app.use((req, res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error); //바로 아래 에러처리 미들웨어로 넘김
})



//에러처리 미들웨어  : 미들웨어를 사용하여 에러 처리가 가능하다.
//모든 라우터들 가장 아래에 처리한다
//반드시 err ~ next까지 모두 변수를 적어주어야 작동한다!
app.use((err,req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //개발모드일때는 에러 내용이 보여지게 하고, 배포모드일때는 안보이게 하기
    res.status(err.status || 500);
    res.render('error');
});



app.listen(app.get('port'), ()=>{
    logger.info(app.get('port'),'번 포트 실행 완료');
});