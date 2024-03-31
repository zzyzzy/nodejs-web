// express, mustache 라이브러리 초기화
const express = require('express');
const mustacheExpress = require('mustache-express');

// postgres 라이브러리 초기화
const { Pool } = require('pg');
const os = require('os');

// express 라는 mvc 라이브러리 설정
const app = express();
app.use(express.static('public'));  // css,js 경로 지정
app.set('view engine', 'html');     // 뷰 엔진 설정
app.engine('html', mustacheExpress());  // html 파일 처리기 등록
app.set('views', __dirname);

// postgres 초기화
const dbhost = process.env.DB_HOST || 'localhost';
console.log(`DB_HOST: ${dbhost}`);
const pool = new Pool({
    host: dbhost,
    user: 'dockeruser',
    password: 'abc123!',
    database: 'pets',
    port: 5432
});

// 웹 요청 처리 라우트 설정
app.get('/', (req, res) => {
    res.status(200).send('<h1>마사이 마라 국립 야생 동물원</h1>');
});

app.get('/images', async (req, res) => {
    const result = await pool.query('select * from images');
    res.status(200).json({ info: result.rows });
});

app.get('/animal', async (req, res) => {
    const imageId = getRandomInt(12) + 1;
    const result = await pool.query(
        'select * from images where imageid=$1', [imageId]);
    const url = result.rows[0].url;
    res.render('index', {
        url: url,
        hostname: os.hostname()
    });
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//app.get('/', (req, res) => {});

// 웹 서버 메인
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Application listening on port ${port}`);
});




