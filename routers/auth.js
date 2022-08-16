
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';  //개발모드인지 배포모드인지 현재 상태를 확인(.env에 NODE_ENV = production 를 설정하지 않으면 기본값인 development 가 생성된다)
const config = require('../config/config')[env];    // config > config.json에 설정한 db 접속 정보를 가져온다.

const sequelize = new Sequelize(config.database, config.username, config.password, config); //db 접속 정보를 설정 한다.


//sql 생성 함수 모듈 가져오기
const sqlFuncs = require('./sql');
//console.log(sqlFuncs);



//const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();


//회원가입 post router 생성
router.post('/join', async(req, res, next)=>{
    const {email, nick, password} = req.body;
    //console.log(email, req.body)
    try{
        let sql = sqlFuncs.isUserExist(email);
        const [isExist, metadata] = await sequelize.query(sql);

        if(isExist.length!=0){
            //이메일이 존재할경우
            return res.redirect('/join?error=exist');
        }

        const hash = await bcrypt.hash(password, 12);  // 비밀번호 해시화 (12레벨)
        sql = sqlFuncs.insertMember(email, nick, hash); 
        await sequelize.query(sql);
        return res.redirect('/');
        
    }catch(err){
        console.log(err)
        return next(err);
    }

})

module.exports = router;