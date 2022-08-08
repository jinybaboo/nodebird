const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
//const { isLoggedIn } = require('./middlewares');

//sql 생성 함수 모듈 가져오기
const sqlFuncs = require('./sql');
// console.log(sqlFuncs);

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}


// 게시글을 쓸때 이미지를 먼저 업로드 시킨다.
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, 'userId_'+Date.now() + ext); //한글깨짐등으로 파일명을 임의 설정
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});


// 앞에서 이미지를 업로드 했기 때문데 upload2.none() 을 추가하여 이미지는 업로드 안되도록 하고 게시글만 따로 올려준다 (이미지를 먼저 올려서 submit시 사용자 시간이 지체 되지 않도록하기 위하여 )
const upload2 = multer();
router.post('/', upload2.none(), async (req, res, next) => { 
  try {
    // const post = await Post.create({
    //   content: req.body.content,
    //   img: req.body.url,
    //   UserId: req.user.id,
    // });

    const {content, url:img } = req.body;
    let sql = sqlFuncs.insertPost('tinglab@naver.com', content, img)

   
    //const userId = req.user.id;

    console.log(content, img);



    // const hashtags = req.body.content.match(/#[^\s#]*/g);    // 해시태그만 뽑아서 배열로 리턴함
    // if (hashtags) {
    //   const result = await Promise.all(
    //     hashtags.map(tag => {
    //       return Hashtag.findOrCreate({
    //         where: { title: tag.slice(1).toLowerCase() },
    //       })
    //     }),
    //   );
    //   await post.addHashtags(result.map(r => r[0]));
    // }
    res.redirect('/'); // 메인페이지로 보냄
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;