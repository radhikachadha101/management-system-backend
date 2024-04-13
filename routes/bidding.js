var express = require('express');
var router = express.Router();
var BiddingController = require('../controllers/bidding')
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/proposals')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      cb(null, file.fieldname + '-' + Date.now()+ ext)
    }
  })
  var upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype =='application/pdf'
           || file.mimetype == 'application/msword' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });
/* GET task listing. */
router.get('/proposalstatus',BiddingController.findstatus);
router.get('/stats',BiddingController.statistics);
router.get('/bidstatus',BiddingController.bidstatus);
router.get('/bidstatus/:id', BiddingController.StatusById);
router.post('/profile/create',BiddingController.createProfile);
router.post('/bidstatus/create',BiddingController.createStatus);
router.get('/profile/:id', BiddingController.ProfileById);
router.get('/countries',BiddingController.countries);
router.get('/skills', BiddingController.skills);
router.get('/channels', BiddingController.channels);
router.get('/status', BiddingController.status);
router.post('/skills', BiddingController.CreateSkills);
router.get('/skills/:id', BiddingController.skillById);
router.get('/bidProfile',BiddingController.BidProfiles);
router.get('/clients',BiddingController.client);
router.get('/', BiddingController.findProposals);
router.get('/proposalType', BiddingController.proposalType);
router.get('/:id', BiddingController.findOneProposal);
router.post('/changeStatus',BiddingController.changeStatus);
router.post('/addClient',BiddingController.addClient);
router.get('/client/:id', BiddingController.clientById);
router.post('/addComment',BiddingController.addComment);
router.post('/', upload.array('files'),BiddingController.create);
router.put('/:id',upload.array('files'),BiddingController.update);
router.put('/profile/update/:id',BiddingController.updateProfile);
router.put('/client/update/:id',BiddingController.updateClient);
router.put('/skills/update/:id',BiddingController.updateSkill);
router.put('/bidstatus/update/:id',BiddingController.updateStatus);
router.delete('/documemnt/:id',BiddingController.documemtDelete);
















module.exports = router;
