const { Router } =require('express');
const PostService =require('../services/postService.js');

const router =Router();
const Service =new PostService();

router.get('/', Service.fetch);
router.post('/new', Service.create);
router.post('/likes/new', Service.like);
router.post('/comments/new', Service.comment);
router.get('/comments/:id', Service.fetch_comments);

const route ={name: 'posts', router};
module.exports =route;