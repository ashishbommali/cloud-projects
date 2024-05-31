const db =require('../models/index.js');
const {HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK} =require('../utils/http_status_codes.js');

const model =db.group;

class ChatService{

    create =async (req, res) =>{
        const {creator, name} =req.body;
        try {
            
        } catch (error) {
            
        }
    }

    create_chat =async (req, res) =>{

    }

    send_message =async (req, res) =>{

    }
}

module.exports =ChatService;