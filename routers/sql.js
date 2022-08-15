
// select 
const isUserExist = (email) => `SELECT email FROM user where email = '${email}'`;


//insert
const insertMember = (email, nick, pass) => `insert into user(email,nick,password, joinDate) values('${email}','${nick}','${pass}', now() )`;
const insertPost = (email, content, img, hashtag) => `insert into post(email,content,img, hashtag, writeTime) values('${email}','${content}','${img}','${hashtag}', now() )`;
const insertFeeling = (emotion, message) => `insert into FEELING(emotion,message) values('${emotion}','${message}')`;

const aaa = '11111';



module.exports ={
    isUserExist, 
    insertMember, 
    insertPost,
    insertFeeling,
    aaa
}