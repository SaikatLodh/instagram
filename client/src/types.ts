export interface ProfilePicture {
  public_id: string;
  url: string;
}

export interface CommentAuthor {
  _id: string;
  username: string;
  profilePicture: ProfilePicture;
}

export interface Content {
  url: string;
  public_id: string;
}

export interface Comment {
  _id: string;
  text: string;
  post: string;
  author: CommentAuthor; // or Author if you populate author details
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageFolloers {
  _id: string;
  username: string;
  profilePicture: ProfilePicture;
  bio: string;
}

export interface NotificationPostContent {
  url: string;
  public_id: string;
}

export interface NotificationPost {
  _id: string;
  caption: string;
  author: string; // user ID
  comments: Comment[]; // or CommentType[] if you want to type comments
  contant: NotificationPostContent;
  createdAt: string;
  updatedAt: string;
  likes: string[];
}

export interface Author {
  _id: string;
  username: string;
  email: string;
  bio: string;
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
  followers: string[];
  following: string[];
  isverified: boolean;
  posts: string[];
  profilePicture: ProfilePicture;
  resetPasswordExpire: string | null;
  resetPasswordToken: string | null;
  gender?: string; // optional, add if present
}

export interface PostType {
  _id: string;
  caption: string;
  comments: Comment[];
  contant: Content;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  author: Author;
}

export interface CommentType {
  _id: string;
  text: string;
  author: CommentAuthor;
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  profilePicture: ProfilePicture;
  _id: string;
  username: string;
  email: string;
  bio: string;
  followers: string[]; // Array of user IDs or strings
  following: string[]; // Array of user IDs or strings
  posts: PostType[] | undefined; // Array of post IDs or strings
  bookmarks: PostType[]; // Array of bookmark IDs or strings
  resetPasswordToken: string | null;
  resetPasswordExpire: string | null; // Can be a Date or string depending on implementation
  isverified: boolean;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
  reels: PostType[];
}

export interface SingelUser {
  profilePicture: ProfilePicture;
  _id: string;
  username: string;
  bio: string;
  followers: string[]; // Array of user IDs or strings
  following: string[]; // Array of user IDs or strings
  posts: PostType[] | undefined; // Array of post IDs or strings
  createdAt?: string;
  updatedAt?: string;
  reels: PostType[];
}

export interface suggestedusers {
  _id: string;
  username: string;
  email: string;
  profilePicture: ProfilePicture;
  createdAt: string;
  updatedAt: string;
}

export interface searchUserShape {
  _id: string;
  username: string;
  email: string;
  profilePicture: ProfilePicture;
  createdAt: string;
  updatedAt: string;
  followers: string[]; // Array of user IDs or strings
  following: string[];
}

export interface MassageUser {
  _id: string;
  followers: MessageFolloers[];
  following: MessageFolloers[];
}

export interface MessageType {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationType {
  _id: string;
  message: string;
  post: NotificationPost;
  postId: string;
  type: string;
  userDetails: {
    _id: string;
    username: string;
    profilePicture: ProfilePicture;
  };
  userId: string;
}

export interface StoryContent {
  type: "image" | "video";
  url: string;
  duration?: number;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: ProfilePicture;
  contents: StoryContent[];
  seen?: boolean;
}

export interface createStory {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture: ProfilePicture;
  };
  titel: string;
  story: ProfilePicture;
  createdAt: string;
  updatedAt: string;
}
