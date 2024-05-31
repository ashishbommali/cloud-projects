const db =require('../models/index.js');
const {HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK} =require('../utils/http_status_codes.js');

const model =db.post;

class NotificationService{

    fetch_user_notifications =async (req, res) =>{

    }

    notify_user =async (req, res) =>{

    }
}

module.exports =ChatService;