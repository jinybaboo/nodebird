
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';  //개발모드인지 배포모드인지 현재 상태를 확인(.env에 NODE_ENV = production 를 설정하지 않으면 기본값인 development 가 생성된다)
const config = require('../config/config')[env];    // config > config.json에 설정한 db 접속 정보를 가져온다.

//const User = require('./user');  //user 테이블에 접근하기 위한 models > user.js 
//const Post = require('./post');
//const Hashtag = require('./hastag');


const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); //db 접속 정보를 설정 한다.

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db.User = User;

//User.init(sequelize);
//Comment.init(sequelize);

//User.associate(db);
//Comment.associate(db);

module.exports = db;