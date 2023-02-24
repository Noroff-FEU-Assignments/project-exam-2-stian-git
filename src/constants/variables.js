export const apiBaseUrl = "https://nf-api.onrender.com/api/v1/social";
//alternative base url: export const apiBaseUrl = "https://api.noroff.dev/api/v1/social";

export const storageKeyFollowedUsers = "socialUsersFollowed";
export const storageKeySessionInfo = "socialSessionInfo";
export const tagsToShow = 5;

//RegEx used to identify a valid URL for media. Notice how filetypes can be changed by adding |.ext inside the parenthesis.
export const mediaUrlSyntax = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg|.bmp|.jpeg)(\?[^\s[",><]*)?|^$/;

export const allowedUserNameRegex = /^[\w\d]*$/;

export const validEmailDomains = ["stud.noroff.no", "noroff.no"];

export const defaultAvatar = "\\images\\default_avatar_60pst opacity.png";

export const availableEmojies = ["❤️", "😂", "😢", "👿"];
export const postsToLoad = 25;
export const profilesToLoad = 25;
export const minPasswordLength = 8;

export const maxTagsInpost = 8;

export const minCommentlength = 3;
export const maxCommentLength = 280;
