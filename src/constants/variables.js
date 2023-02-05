export const apiBaseUrl = "https://nf-api.onrender.com/api/v1/social";
//alternative base url: export const apiBaseUrl = "https://api.noroff.dev/api/v1/social";

export const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTMyLCJuYW1lIjoic21nX3Rlc3R1c2VyIiwiZW1haWwiOiJmaXJzdC5sYXN0bmFtZUBzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiYmFubmVyIjpudWxsLCJpYXQiOjE2NzMzNjE2NzV9.1b_KFqGHfPJjlHMJ0Yvc04OV6unnjJ8ddg0pUMona-c";

//RegEx used to identify a valid URL for media. Notice how filetypes can be changed by adding |.ext inside the parenthesis.
export const mediaUrlSyntax = /((http|https):\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/;
// Below regex works, but has not been tested against the API. Does it support all of these?
export const allowedUserNameRegex = /^[\w\d\!\%\@\$\+\&\~\#\^\*\=\|]*$/;
export const validEmailDomains = ["stud.noroff.no", "noroff.no"];

export const defaultAvatar = "\\images\\default_avatar_60pst opacity.png";

//Check this resource before changing emoji Version: https://emojipedia.org/emoji-versions/
export const emojiVersion = "15.1";

export const availableEmojies = ["❤️","😂","😢","👿"]
export const postsToLoad = 100;
export const profilesToLoad = 100;
export const minPasswordLength = 8;
export const testPost = [
  {
    title: "Happy 2023!",
    body: "This is just a test post where we usually put a status or gets mad an unimportant things we care about",
    tags: ["post tag"],
    media: "https://media.tenor.com/1tqGmyaP-pQAAAAd/2023-happy2023.gif",
    created: "2023-01-02T14:30:53.604Z",
    updated: "2023-01-02T14:31:25.546Z",
    id: 2061,
    _count: {
      comments: 0,
      reactions: 2,
    },
  },
  {
    title: "tester",
    body: "tester",
    tags: [],
    media: "https://media.tenor.com/rqJigJfNUBgAAAAC/the-simpsons-homer-simpson.gif",
    reactions: [
      {
        symbol: "👍",
        count: 1,
        postId: 2112,
      },
      {
        symbol: "😍",
        count: 22,
        postId: 2112,
      },
    ],
    comments: [
      {
        body: "1q",
        replyToId: null,
        id: 615,
        postId: 2112,
        owner: "Sovtuss",
        created: "2023-01-10T10:52:06.019Z",
        author: {
          name: "Sovtuss",
          email: "andrii.sovtus.21@stud.noroff.no",
          avatar: "https://scontent.flwo6-1.fna.fbcdn.net/v/t1.18169-9/10423284_743513939050404_6749140362975561059_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=ba80b0&_nc_ohc=jbdhZFP1DTgAX9dJLUL&_nc_ht=scontent.flwo6-1.fna&oh=00_AfCmaHd6tkgEtOsr_R4BemMtl7dFzNw1C1clDIkGB-gm1A&oe=63E4B888",
          banner: "https://www.meme-arsenal.com/memes/4f79a1cdac6b8d14917a433aaaf57045.jpg",
        },
      },
    ],
    created: "2023-01-09T10:38:14.626Z",
    updated: "2023-01-09T10:38:14.626Z",
    id: 2112,
    author: {
      name: "tim744",
      email: "tim744@noroff.no",
      avatar: null,
      banner: null,
    },
    _count: {
      comments: 1,
      reactions: 2,
    },
  },
];
