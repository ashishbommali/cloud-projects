import API from ".";

export const register =async details =>{
    try {
        const {status} =await API.post('/users/auth/register', details);
        return {status};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}

export const login =async credentials =>{
    try {
        const {status, data} =await API.post('/users/auth/login', credentials);
        return {status, data};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}

export const updateBio =async details =>{
    try {
        const {status, data} =await API.post('/users/profile/change-bio-details', details);
        return {status, data};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}
export const updateProfileImage =async details =>{
    try {
        console.log(details);
        const {status, data} =await API.post('/users/profile/change-photo', details);
        return {status, data};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}

export const forgot =async ({email}) =>{
    try {
        const {status, data} =await API.post('/users/auth/forgot-password', {email});
        return {status, data};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}

export const resetPassword =async ({password, id}) =>{
    try {
        const {status} =await API.post(`/users/auth/reset-password`, {password, id});
        return {status};
    } catch({response: {status, data}}) {
        return {status, data}
    }
}

export const changePassword =async details =>{
    try {
        const {status, data} =await API.post(`/users/auth/change-password`, details);
        return {status, data};
    } catch({response: {status, data}}) {
        return {status, data};
    }
}

export const getUsers =async (id) =>{
    try {
        const {status, data} =await API.get(`/users/connections/strangers/${id}`);
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}

export const getFriends =async id =>{
    try {
        const {status, data} =await API.get(`/users/connections/friends/${id}`);
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}

export const getFriendRequests =async ({id}) =>{
    try {
        const {status, data} =await API.get(`/users/connections/requests/${id}`);
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}

export const sendFriendRequest =async ({by, to}) =>{
    try {
        const {status, data} =await API.post(`/users/connections/requests/new`, {by, to});
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}

export const respondFriendRequest =async details =>{
    try {
        const {status, data} =await API.post(`/users/connections/requests/respond`, details);
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}

export const unFriendUser =async details =>{
    try {
        const {status, data} =await API.post(`/users/connections/requests/unfriend`, details);
        return {status, data};
    } catch({response: {status}}) {
        return {status, data}
    }
}