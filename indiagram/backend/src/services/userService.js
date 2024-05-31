require('dotenv/config');
const jwt =require('jsonwebtoken');
const { Op } = require('sequelize');
const db =require('../models/index.js');
const Hash =require('../utils/hash.js');
const { STATUS } = require('../utils/constants.js');
const {HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_401_UNAUTHORISED, HTTP_404_NOT_FOUND} =require('../utils/http_status_codes.js');

const UserModel =db.user;
const GroupModel =db.group;
const FriendsModel =db.friend;
const GroupMembersModel =db.group_members;
const FriendRequestsModel =db.friend_request;

class UserService{
    get_strangers =async user_id =>{
        try {
            const user =await UserModel.findOne({where: {id: user_id}});
            if(!user) return [HTTP_401_UNAUTHORISED, {message: 'Login required*'}];
            const friends =[...await FriendsModel.findAll({
                where: {
                    [Op.or]: {
                        user_id: user_id,
                        friend_id: user_id
                    }
                },
            })].map(friend =>friend.user_id ==user_id? friend.friend_id: friend.user_id);
            const requests =[...await FriendRequestsModel.findAll({
                where: {
                    [Op.or]: {
                        to: user_id,
                        by: user_id
                    }
                },
            })].map(({to, by}) =>to ==user_id? by: to);
            const known_people =[...new Set([...requests, ...friends]).values()];
            const people =[...await UserModel.findAll()].map(({id, name, profile_photo}) =>{
               return {id, name, profile_photo};
            }).filter(person =>{
                const personIsKnown =known_people.find(userid =>userid ==person.id);
                if(!personIsKnown) return person
            }).filter(({id}) => id !=user_id);
            return [HTTP_200_OK, people];
        } catch ({message}) {
            return [HTTP_500_INTERNAL_SERVER_ERROR, {message}];
        }
    }

    register =async (req, res) =>{
        const {name, email, password} =req.body;
        try {
            if(await UserModel.findOne({where: {email}})) return res.status(HTTP_409_CONFLICT).json({email: 'Email selected is already taken'});
            await UserModel.create({name, email, password: await Hash.hash(password)});
            return res.status(HTTP_201_CREATED).json({message: 'Account created successfully'});
            
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message});
        }
    }

    login =async (req, res) =>{
        const {email, password} =req.body;
        try {
            const user =await UserModel.findOne({where: {email}});
            if(!user) return res.status(HTTP_401_UNAUTHORISED).json({password: 'Incorrect email or password'});
            if(!await Hash.compare(password, user.password)) return res.status(HTTP_401_UNAUTHORISED).json({password: 'Incorrect email or password'});
            
            // generate token
            const session ={id: user.id, name: user.name, email: user.email}
            const access_token =jwt.sign(session, process.env.SECRET_KEY);
            return res.status(HTTP_200_OK).json({...session, profile_photo: user.profile_photo, access_token});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({password: message});
        }
    }

    forgot =async (req, res) =>{
        const {email} =req.body;
        try {
            const user =await UserModel.findOne({where: {email}});
            if(!user) return res.status(HTTP_404_NOT_FOUND).json({email: 'Email does not exists'});
            return res.status(HTTP_200_OK).json({id: user.id});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({email: message});
        }
    }

    reset =async (req, res) =>{
        const {password, id} =req.body;
        try {
            await UserModel.update({password: await Hash.hash(password)}, {where: {id}});
            return res.status(HTTP_200_OK).json({message: true});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({email: message});
        }
    }

    change =async (req, res) =>{
        const {opassword, npassword, cpassword, id} =req.body;
        try {
            const user =await UserModel.findOne(({where: {id}}));
            if(!user) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'})
            if(npassword !=cpassword) return res.status(HTTP_400_BAD_REQUEST).json({cpassword: 'Passwords do not match*'});
            if(!await Hash.compare(opassword, user.password)) return res.status(HTTP_400_BAD_REQUEST).json({opassword: 'Incorrect password*'});
            await UserModel.update({password: await Hash.hash(npassword)}, {where: {id}});
            return res.status(HTTP_200_OK).json({message: true});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({cpassword: message});
        }
    }
    update_profile_photo =async (req, res) =>{
        const {id, filepath} =req.body;
        try {
            const user =await UserModel.findOne({where: {id}});
            if(!user) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. User not found'});
            await UserModel.update({profile_photo: filepath}, {where: {id}});
            return res.status(HTTP_200_OK).json({message: 'Profile photo changed successfully'})
            
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message});
        }
    }
    
    update_bio_details =async (req, res) =>{
        const {id, name, email} =req.body;
        try {
            const user =await UserModel.findOne({where: {id}});
            if(!user) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. User not found'});
            await UserModel.update({name, email}, {where: {id}});
            return res.status(HTTP_200_OK).json({message: 'Bio details updated successfully'});
            
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message});
        }
    }

    fetch_friends =async(req, res) =>{
        const { userid } =req.params;
        try {
            const user =await UserModel.findOne({where: {id: userid}});
            if(!user) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const friendList =[];
            const friends =[...await FriendsModel.findAll({
                where: {
                    [Op.or]: {
                        user_id: userid,
                        friend_id: userid
                    }
                },
            })];
            for(let i =0; i<friends.length; i++){
                const {id, user_id, friend_id} =friends[i];
                const friend =await UserModel.findOne({where: {id: userid ==user_id? friend_id: user_id}});
                if(friend){
                    friendList.push({friendship_id: id, id: friend.id, name: friend.name, profile_photo: friend.profile_photo});
                }
            }
            return res.status(HTTP_200_OK).json(friendList);
        } catch ({message}) {
           return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    fetch_none_friends =async(req, res) =>{
        const { user_id } =req.params;
        const [status, payload] =await this.get_strangers(user_id);
        return res.status(status).json(payload)
    }

    unfriend_user =async(req, res) =>{
        const { name, id } =req.body;
        try {
            await FriendsModel.destroy({where: {id}});
            return res.status(HTTP_200_OK).json({message: `${name} has been removed from your friends list`});
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message})
        }
    }

    fetch_requests =async (req, res) =>{
        const {user} =req.params;
        try {
            const currentUser =await UserModel.findOne({where: {id: user}});
            if(!currentUser) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const requestsReceived =await currentUser.getRequests_sent();
            const pendingRequests =[...requestsReceived].map(({id, name, profile_photo, friend_request}) =>{
                return {sender_id: id, name, profile_photo, request_id: friend_request.id, request_status: friend_request.status}
            }).filter( ({request_status}) =>request_status ==STATUS.PENDING);
            return res.status(HTTP_200_OK).json(pendingRequests);
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    send_request =async (req, res) =>{
        const {by, to} =req.body;
        try {
            const sender =await UserModel.findOne({where: {id: by}});
            if(!sender) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const receiver =await UserModel.findOne({where: {id: to}});
            if(!receiver) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. Recipient not found'});
        
            const [status, payload] =await this.get_strangers(by);
            if(status ==HTTP_200_OK){
                const receiverIsUnKnown =[...payload].find(({id}) =>id ==to);
                if(receiverIsUnKnown) {
                    await sender.addRequests_received(receiver);
                    return res.status(HTTP_201_CREATED).json({message: 'Friend request sent'})
                };
                return res.status(HTTP_409_CONFLICT).json({message: 'Request sent already'});
            }
            return res.status(status).json(payload);

        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    create_group =async (req, res) =>{
        const {name, user} =req.body;
        try {
            const creator =await UserModel.findOne({where: {id: user}});
            if(!creator) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const group =await GroupModel.create({name});
            await group.setCreator(creator);
            return res.status(HTTP_201_CREATED).json({message: `You created group ${name}`});
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message});
        }
    }

    join_group =async (req, res) =>{
        const {group, user} =req.body;
        try {
            const member =UserModel.findOne({where: {id: user}});
            if(!member) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const groupFound =await GroupModel.findOne({where: {id: group}});
            if(!groupFound) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. Group missing*'});
            const isMember = await GroupMembersModel.findOne({ where: { member_id: user, group_id: group },});
            if(isMember) return res.status(HTTP_400_BAD_REQUEST).json({ message: 'You are already a member' });
            await GroupMembersModel.create({ member_id: user, group_id: group,});
            return res.status(HTTP_201_CREATED).json({message: `You joined group ${groupFound?.name}`});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    respond_to_request =async (req, res) =>{
        const { user, status, request_id} =req.body;
        try {
            const recipient =await UserModel.findOne({where: {id: user}});
            if(!recipient) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const request =await FriendRequestsModel.findOne({where: {id: request_id}});
            if(!request) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. request not found'})
            const sender =await UserModel.findOne({where: {id: request.by}});
            if(status ==STATUS.ACCEPTED) await recipient.setFriendsList(sender);
            if(status !=STATUS.PENDING) await FriendRequestsModel.destroy({where: {id: request_id}}); 
            return res.status(HTTP_200_OK).json({message: `Friend request ${status}`});
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    fetch_groups =async (_, res) =>{
        try {
            const groups =await GroupModel.findAll();
            return res.status(HTTP_200_OK).json(groups);
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }

    fetch_groups_joined =async (req, res) =>{
        const { user } =req.params;
        try {
            const member =await UserModel.findOne({where: {id: user}});
            if(!member) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'});
            const groups =await member.getGroupsJoined();
            return res.status(HTTP_200_OK).json([...groups].map(({id, name}) =>{ return {id, name}}));
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message});
        }
    }


}

module.exports =UserService;