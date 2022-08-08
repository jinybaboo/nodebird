const express = require ('express');
const router = express.Router(); //router 분리시에선 app 이 아닌 router를 호출 한다.



router.use((req, res, next)=>{
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdLost = [];
    next();
});


//profile Get 라우터
router.get('/profile', (req, res)=>{
    res.render('profile', {title:'내정보 - NodeBird'});
});


//join get 라우터
router.get('/join', (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
  });
  
//main get 라우터
router.get('/', (req, res, next) => {
const twits = [];
res.render('main', {
    title: 'NodeBird',
    twits,
});
});
  


module.exports = router;