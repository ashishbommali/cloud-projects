const { Router } =require('express');
const UserService =require('../services/userService.js');

const router =Router();
const Service =new UserService();

router.post('/auth/login', Service.login);
router.post('/auth/register', Service.register);
router.post('/auth/reset-password', Service.reset);
router.post('/auth/change-password', Service.change);
router.post('/auth/forgot-password', Service.forgot);
router.get('/connections/groups', Service.fetch_groups);
router.post('/connections/groups/join', Service.join_group);
router.post('/connections/groups/new', Service.create_group);
router.post('/connections/requests/new', Service.send_request);
router.get('/connections/friends/:userid', Service.fetch_friends);
router.get('/connections/groups/:user', Service.fetch_groups_joined);
router.post('/connections/requests/respond', Service.respond_to_request);
router.get('/connections/strangers/:user_id', Service.fetch_none_friends);
router.post('/connections/requests/unfriend', Service.unfriend_user);
router.get('/connections/requests/:user', Service.fetch_requests);
router.post('/profile/change-photo', Service.update_profile_photo);
router.post('/profile/change-bio-details', Service.update_bio_details);

const route ={name: 'users', router};
module.exports =route;