const db =require('../models/index.js');
const { STATUS } = require('../utils/constants.js');
const {HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK} =require('../utils/http_status_codes.js');

const FriendRequestsModel =db.friend_request;

class RequestService{

    fetch =async (_, res) =>{

        try {
            const requests =await FriendRequestsModel.findAll({where: {status: STATUS.PENDING, }});
            return res.status(HTTP_200_OK)
        } catch (error) {
            
        }
    }

    send =async (req, res) =>{

    }

    manage =async (req, res) =>{

    }
}

module.exports =RequestService;