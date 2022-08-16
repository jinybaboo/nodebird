
// select 
exports.isUserExist = (email) => `SELECT email FROM user where email = '${email}'`;
exports.getFeeling = () => `SELECT * FROM FEELING `;


//insert
exports.insertMember = (email, nick, pass) => `insert into user(email,nick,password, joinDate) values('${email}','${nick}','${pass}', now() )`;
exports.insertPost = (email, content, img, hashtag) => `insert into post(email,content,img, hashtag, writeTime) values('${email}','${content}','${img}','${hashtag}', now() )`;
exports.insertFeeling = (emotion, message) => `insert into FEELING(emotion,message) values('${emotion}','${message}')`;

exports.aaa = '11111';

