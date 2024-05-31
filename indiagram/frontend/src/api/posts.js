import API from ".";

const root ='/posts';

export const fetchPosts =async id =>{
    const {status, data} =await API.get(`${root}/?user=${id}`);
    return {status, data};
}
 
export const uploadPost =async post =>{
    const {status, data} =await API.post(`${root}/new`, post);
    return {status, data};
}

export const commentPost =async comment =>{
    const {status, data} =await API.post(`${root}/comments/new`, comment);
    return {status, data};
}

export const reactToPost =async postDetails =>{
    const {status, data} =await API.post(`${root}/likes/new`, postDetails);
    return {status, data};
}

export const fetchPostComments =async post =>{
    const {status, data} =await API.get(`${root}/comments/${post}`);
    return {status, data};
}

