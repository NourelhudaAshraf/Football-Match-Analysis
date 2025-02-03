const express = require ('express');
const mysql = require ('mysql');
const cors = require ('cors');
const session = require('express-session')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json())
app.use(cors(
    {
        origin:["http://localhost:3000"],
        methods:["POST" , "GET"],
        credentials:true
    }
));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(
    {secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure:false,
        maxAge:1000*60*60*24
    }
}
));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"signup"
})
// const videosDirectory = path.join(__dirname, 'videos/');
// if (!fs.existsSync(videosDirectory)) {
//   fs.mkdirSync(videosDirectory);
// }
const upload = multer();

async function getGameStatistics(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM videos WHERE user_id = ?";
        db.query(sql, id, async (err, data) => {
            if (err) {
                console.error('Error retrieving data:', err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
app.post('/login' ,async (req , res)=>{
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password],async (err, data) => {
        if (err) {
            return res.json({message:err.message , user:null});
        }
        if (data.length > 0)
        {
            const userWithImage = data[0];
            if (userWithImage.image.length !== 0) {
                const image = userWithImage.image.toString('base64'); // Convert Buffer to base64
                userWithImage.imageUrl = `data:image/png;base64,${image}`;
            }
            getGameStatistics(userWithImage.id).then(
                data=>{
                    userWithImage.history = data;
                    req.session.user = userWithImage;
                    return res.json({ message: "Login successful", user:req.session.user});
                }
            );
        }
        else
        {
            return res.json({message:"login failed" , user:null});
        }
    });
})

app.post('/signup' , (req , res)=>{
    const sql = "INSERT INTO login (name,email ,  password) VALUES (?,?,?)";
    db.query(sql , [req.body.name,req.body.email , req.body.password] , (err,data)=>{
        if (err){
            console.error('Error inserting data:', err);
             return res.json("Error");
            }
        return res.json(data);
    })
})

app.post('/uploadImage' ,upload.single('file'), (req , res)=>{
    const image = req.file.buffer;
    const sql = "UPDATE login SET image = ? WHERE id = ?";
    db.query(sql , [image,req.session.user.id] , (err,data)=>{
        if (err){
             return res.json("Error"); }
        const image1 = image.toString('base64'); // Convert Buffer to base64
        req.session.user.imageUrl = `data:image/png;base64,${image1}`;
        return res.json("Success");
    })
})

app.post('/updateData' , (req , res)=>{
    const sql = "UPDATE login SET name = ?, email = ?, password = ? WHERE id = ?";
    db.query(sql , [req.body.name , req.body.email , req.body.password ,req.session.user.id] , (err,data)=>{
        if (err){
             return res.json("Error"); }
        req.session.user.name = req.body.name;
        req.session.user.email = req.body.email;
        req.session.user.password = req.body.password;
        return res.json("Success");
    })
})

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.json({ valid: false , user:null });
    }
    return res.json({ valid: true, user: req.session.user });
});

app.get('/logout', (req, res) => {
    req.session.user = null;
    return res.json({ valid: false , user:null });
});

app.post('/uploadStatistics', upload.fields([{ name: 'json', maxCount: 1 },{name:'userId' , maxCount: 1 } ,{ name: 'ballPossession', maxCount: 1 },{ name: 'match', maxCount: 1 } ]), (req, res) => {
    const sql = "INSERT INTO videos (user_id,game,time,possession,name) VALUES (?,?,?,?,?)";
    const jsonFile =req.body.json;
    const ballPossession = req.body.ballPossession;
    const currentTime = new Date();
    // const videoPath = path.join(videosDirectory, videoName);
    // fs.writeFileSync(videoPath, video.buffer);
    // const videoUrl = `https://${req.hostname}/videos/${videoName}`;
    db.query(sql , [req.body.userId,JSON.stringify(jsonFile),currentTime , JSON.stringify(ballPossession),req.body.match] , (err,data)=>{
        if (err){
            console.error('Error inserting data:', err);
             return res.json("Error");
            }
        getGameStatistics(req.session.user.id).then(
            data=>{
                    req.session.user.history = data;
                    return res.json("Success");
            }
        );
    })
});


app.post('/deleteGameStats' , (req , res)=>{
    const sql = "DELETE from videos WHERE game_id = ?";
    db.query(sql , [req.body.id] , (err,data)=>{
        if (err){
             return res.json("Error");
        }
        getGameStatistics(req.session.user.id).then(
            data=>{
                req.session.user.history = data;
                return res.json("Success");
            }
        );
    })
})


// app.post('/getStatistics',  (req, res) => {
//     const sql = "SELECT * FROM videos WHERE user_id = ?";
//     db.query(sql, [req.body.user],  (err, data) => {
//         if (err) {
//             console.error('Error retrieving data:', err);
//             return res.json({ message: "Error", list: null });
//         }

//         try {
//             return res.json({ message: "Success", list: data });
//         } catch (err) {
//             console.error('Error processing video files:', err);
//             return res.json({ message: "Error", list: null });
//         }
//     });
// });

// app.post('/getStatistics', (req, res) => {
//     const sql = "SELECT * FROM videos WHERE user_id = ?";
//     db.query(sql , [req.body.user] , (err,data)=>{
//         data.forEach(field => {
//             const videoFileName = field.video.split('/').pop();
//             const videoFilePath = path.join(__dirname, 'videos', videoFileName);
//             fs.readFile(videoFilePath, (err, buffer) => {
//                 if (err) {
//                     console.error(`Error reading file ${videoFileName}:`, err);
//                     return;
//                 }
//                 const videoFile = {
//                     fieldname: 'video',
//                     originalname: videoFileName,
//                     buffer: buffer,
//                     mimetype: 'video/mp4',
//                     size: buffer.length
//                 };
//             });
//         });
//         console.log(data);
//         if (err){
//             console.error('Error inserting data:', err);
//              return res.json({message:"Error" , list : null});
//             }
//         return res.json({message:"Success" , list:data});
//     })
// });


app.listen(8081 , ()=>{
    console.log("Listening.......");
})