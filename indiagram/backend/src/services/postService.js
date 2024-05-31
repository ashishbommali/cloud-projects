const timeago =require('timeago.js');
const db =require('../models/index.js');
const {HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_401_UNAUTHORISED} =require('../utils/http_status_codes.js');

const PostModel =db.post;
const UserModel =db.user;
const LikeModel =db.like;
const CommentModel =db.comment;
const AttatchmentModel =db.attatchment;

class PostService{


    fetch =async (req, res) =>{
        const {user} =req.query;
        try {
            const posts =[...await PostModel.findAll({include: [
                {
                    model: UserModel,
                    as: 'author'
                },
                {
                    model: LikeModel,
                    as: 'likes'
                },
                {
                    model: CommentModel,
                    as: 'comments'
                },
                {
                    model: AttatchmentModel,
                    as: 'attatchment'
                }
            ]})].map(({id, body, attatchment, posted_at, author: {profile_photo, name}, likes, comments}) =>{
                const likedByCurrentUser =likes.find(({user_id}) =>user_id ==user);
                const commentedByCurrentUser =comments.find(({author_id}) =>author_id ==user);
                return {id, body, posted_at: timeago.format(posted_at), author_image: profile_photo, author_name: name, attatchment: attatchment?.length? attatchment.at(0)?.url: null, likes: likes?.length, comments: comments?.length, userLiked: likedByCurrentUser? true: false, userCommented: commentedByCurrentUser? true: false}
            });

            return res.status(HTTP_200_OK).json(posts);
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message})
        }
    }

    create =async (req, res) =>{
        const {author, body, attatchment} =req.body
        try {
            const postAuthor =await UserModel.findOne({where: {id: author}});
            if(!postAuthor) return res.status(HTTP_401_UNAUTHORISED).json({message: 'Login required*'})
            const newPost =await PostModel.create({body});
            await newPost.setAuthor(postAuthor);
            if(attatchment) await newPost.setAttatchment(await AttatchmentModel.create({url: attatchment}));
            return res.status(HTTP_201_CREATED).json(newPost.toJSON());
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message}); 
        }
    }

    comment =async (req, res) =>{
        const {user, post, body} =req.body
        try {
            const User =await UserModel.findOne({where: {id: user}});
            if(!User) return res.status(HTTP_401_UNAUTHORISED).json({message:'Login required*'});
            const Post =await PostModel.findOne({where: {id: post}});
            if(!Post) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. Post not found'});
            const newComment = await CommentModel.create({body});
            newComment.setAuthor(User);
            newComment.setPost(Post);
            return res.status(HTTP_201_CREATED).json(newComment.toJSON());
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message})
        }
    }

    like =async (req, res) =>{
        const {post, user} =req.body
        try {
            let liked =false;
            const User =await UserModel.findOne({where: {id: user}});
            if(!User) return res.status(HTTP_401_UNAUTHORISED).json({message:'Login required*'});
            const Post =await PostModel.findOne({where: {id: post}});
            if(!Post) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. Post not found'});
            if(await LikeModel.findOne({where: {user_id: user, post_id: post}})){
                await LikeModel.destroy({where: {user_id: user, post_id: post}})
            }else{
                const like =await LikeModel.create();
                await like.setUser(User);
                await like.setPost(Post);
                liked =true;
            }
            return res.status(HTTP_201_CREATED).json({liked});
        } catch ({message}) {
            return res.status(HTTP_400_BAD_REQUEST).json({message})
        }
    }

    fetch_comments =async (req, res) =>{
        const { id } =req.params;
        try {
            const post =await PostModel.findOne({where: {id}});
            if(!post) return res.status(HTTP_404_NOT_FOUND).json({message: 'Something went wrong. Post missing'});
            const comments =[...await post.getComments({include: {
                model: UserModel,
                as: 'author'
            }})].map(({body, author: {name}}) =>{return {body, author: name}});
            return res.status(HTTP_200_OK).json(comments);
        } catch ({message}) {
            return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({message})
        }
        
    }
}

module.exports =PostService;