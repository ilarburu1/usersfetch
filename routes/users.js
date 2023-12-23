var express = require('express');
var router = express.Router();

const mongojs = require('mongojs');
const db = mongojs('bezeroakdb', ['bezeroak']); 

const path = require('path');
const multer  = require('multer')

let users = [];

const uploadDirectory = path.join(__dirname, '../public/uploads');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileExtension = path.extname(file.originalname);
      const finalFileExtension=file.fieldname + '-' + uniqueSuffix + fileExtension; // Obtener la extensión del archivo original
      cb(null,finalFileExtension);
    }
  })
  
  const imageTypes=['.png','.jpg'];

  const fileFilter = (req, file, cb) => {
    if (imageTypes.includes(path.extname(file.originalname).toLocaleLowerCase())) { 
      cb(null, true);
    } else {
      cb(new Error('Extensioa ez da onartzen. Soilik .png edo .jpg formatuko fitxategiak onartzen dira.'), false);
    }
  };


  const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2*1024*1024,
  },
  fileFilter: fileFilter,
});


db.bezeroak.find( function (err, userdocs){
  if (err) {
    console.log("Error: " + err);
  } else {
    users = userdocs;
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  res.json(users)
  });


router.post("/new", upload.single('avatar'), (req, res) => {

  let imagen = req.file ? req.file.filename : 'avatar-1703351104274-910967901.png';

  const user = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email,
    avatar: imagen, 
  };

  users.push(user);

  db.bezeroak.insert(user, function (err, user){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("Inserted: " + user);
      res.json(user);
    }
  });
});


router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user._id != req.params.id);
  // remove user from mongo
  db.bezeroak.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, user){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("Removed: " + user);
    }
  });
  res.json(users);
});


router.put("/update/:id", upload.single('avatar'), (req, res) => {
  let user = users.find(user => user._id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;

  if (req.file) {
    user.avatar = req.file.filename;
  db.bezeroak.update({_id: mongojs.ObjectId(req.params.id) },
  { $set: {izena: req.body.izena, abizena: req.body.abizena, email: req.body.email, avatar: user.avatar} },
  function (err, updatedUser){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("Updated: " + updatedUser);
    }
  });

  res.json(users);
}else{
  user.avatar="avatar-1703351104274-910967901.png";
  db.bezeroak.update({_id: mongojs.ObjectId(req.params.id) },
  { $set: {izena: req.body.izena, abizena: req.body.abizena, email: req.body.email, avatar: user.avatar} },
  function (err, updatedUser){
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("Updated: " + updatedUser);
    }
  });

  res.json(users);
}
})


module.exports = router;