const endPoints = {
  auth: {
    register: "/user/register",
    login: "/user/login",
    logout: "/user/logout",
    otpsend: "/user/otpsend",
    verifyotp: "/user/verifyotp",
    forgotsendemail: "/user/forgotpassword",
    forgotresetpassword: "/user/resetpassword",
    checkuserlogin: "/user/checkuserlogin",
  },
  user: {
    getuser: "/user/getprofile",
    editeprofile: "/user/editeprofile",
    getotheruser: "/user/otheruserprofile",
    suggestedusers: "/user/suggestuser",
    searchuser: "/search/searchuser",
    getchatusers: "/user/getchatuser",
  },
  post: {
    createpost: "/post/addnewpost",
    getallpost: "/post/getallposts",
    getsingelpost: "/post/getsinglepost",
    updatepost: "/post/editepost",
    deletepost: "/post/deletepost",
  },
  reels: {
    createpost: "/reels/addnewpost",
    getallpost: "/reels/getallposts",
    getsingelpost: "/reels/getsinglepost",
    updatepost: "/reels/editepost",
    deletepost: "/reels/deletepost",
  },
  likeunlike: {
    likeunlikepost: "/post/likeunlike",
    likeunlikepostreels: "/reels/likeunlike",
  },
  bookmark: {
    addbookmark: "/post/bookmarkpost",
  },
  comment: {
    addcomment: "/comment/addcomment",
    getcomment: "/comment/getcommentofpost",
  },
  reelsComment: {
    addcomment: "/reelscomment/addcomment",
    getcomment: "/reelscomment/getcommentofpost",
  },
  followunfollow: {
    followunfollow: "/user/followunfollow",
  },
  message: {
    getmessage: "/message/getmessage",
    sendmessage: "/message/sendmessage",
  },
  story: {
    createstory: "/story/create",
    getstories: "/story/getstories",
    deletestory: "/story/delete",
  },
};

export { endPoints };
