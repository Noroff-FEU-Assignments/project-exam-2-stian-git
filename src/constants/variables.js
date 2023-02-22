export const apiBaseUrl = "https://nf-api.onrender.com/api/v1/social";
//alternative base url: export const apiBaseUrl = "https://api.noroff.dev/api/v1/social";

export const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTMyLCJuYW1lIjoic21nX3Rlc3R1c2VyIiwiZW1haWwiOiJmaXJzdC5sYXN0bmFtZUBzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiYmFubmVyIjpudWxsLCJpYXQiOjE2NzMzNjE2NzV9.1b_KFqGHfPJjlHMJ0Yvc04OV6unnjJ8ddg0pUMona-c";

export const storageKeyFollowedUsers = "socialUsersFollowed";
export const storageKeySessionInfo = "socialSessionInfo";
//export const
export const tagsToShow = 5;

//RegEx used to identify a valid URL for media. Notice how filetypes can be changed by adding |.ext inside the parenthesis.
export const mediaUrlSyntax = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?|^$/;
export const mediaUrlSyntax_old = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/;
// Below regex works, but has not been tested against the API. Does it support all of these?
export const allowedUserNameRegex = /^[\w\d\!\%\@\$\+\&\~\#\^\*\=\|]*$/;
export const validEmailDomains = ["stud.noroff.no", "noroff.no"];

export const defaultAvatar = "\\images\\default_avatar_60pst opacity.png";

export const availableEmojies = ["❤️", "😂", "😢", "👿"];
export const postsToLoad = 100;
export const profilesToLoad = 100;
export const minPasswordLength = 8;
