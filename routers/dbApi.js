
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';  //개발모드인지 배포모드인지 현재 상태를 확인(.env에 NODE_ENV = production 를 설정하지 않으면 기본값인 development 가 생성된다)
const config = require('../config/config')[env];    // config > config.json에 설정한 db 접속 정보를 가져온다.

const sequelize = new Sequelize(config.database, config.username, config.password, config); //db 접속 정보를 설정 한다.


//sql 생성 함수 모듈 가져오기
const sqlFuncs = require('./sql');



exports.insertFeeling = async (data)=>{
    const {emotion, message} = data;
    try{
        let sql = sqlFuncs.insertFeeling(emotion, message);
        return await sequelize.query(sql);
    }catch(err){
        console.log(err)
        return next(err);
    }
}

exports.getFeeling = async (data)=>{
    try{
        let sql = sqlFuncs.getFeeling();
        //SELECT 할때 결과값이 2번 중복 나오면 쿼리타입을 설정해주면 된다.
        return await sequelize.query(sql, {type:sequelize.QueryTypes.SELECT});  
    }catch(err){
        console.log(err)
        return next(err);
    }
}
