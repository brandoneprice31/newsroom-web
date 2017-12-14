export const signInUser = (user) => {
    console.log("Signed in user: ", user.username);
    return {
        type: 'USER_SIGNED_IN',
        payload: user
    }
};

export const logOutUser = (user) => {
    console.log("Logging out user");
    return {
        type: 'USER_LOGGED_OUT'
    }
};

export const pageChange = (page) => {
    console.log("Page changed to: ", page);
    return {
        type: 'PAGE_CHANGED',
        payload: page
    }
};

export const commentsChange = (comments) => {
    console.log("Comments changed to: ", comments);
    return {
        type: 'COMMENTS_CHANGED',
        payload: comments
    }
};
