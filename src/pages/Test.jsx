import React, { useEffect, useState } from "react";
import { tagsToShow } from "../constants/variables";
const testData = [
  {
    title: "Just a test from mobile screen",
    body: "Some testing of responsive design. How does this look when writing multiple lines? \nAlso chosed a smaller image. Does it look okey?",
    tags: ["tag1", "ta", "sometag", "anothertag", "test2", "test3"],
    media: "https://charts-static.billboard.com/img/2022/11/rihanna-k0p-liftmeup-5gp-344x344.jpg",
    created: "2023-02-17T15:51:02.351Z",
    updated: "2023-02-17T15:51:02.351Z",
    id: 3094,
    _count: {
      comments: 1,
      reactions: 2,
    },
  },
  {
    title: "Test post 10.2.",
    body: "Some test content with nothing special to write about.",
    tags: ["tagone"],
    media: "",
    created: "2023-02-10T13:04:44.837Z",
    updated: "2023-02-10T13:04:44.837Z",
    id: 2807,
    _count: {
      comments: 0,
      reactions: 2,
    },
  },
  {
    title: "Pisspreik",
    body: "Nok en test4. Etter endring av session data.",
    tags: ["tag1", "tag2", "tag3", "Nytagg!"],
    media: "https://akamai.vgc.no/dredition-images/769/135/76913553/76913553-teaser-top-c8885d815ff2bff8c179fb998e1d76f3.jpg",
    created: "2023-01-26T19:42:22.464Z",
    updated: "2023-02-15T11:59:32.847Z",
    id: 2498,
    _count: {
      comments: 3,
      reactions: 5,
    },
  },
  {
    title: "Posted 17.1.2023",
    body: "Just another test",
    tags: ["test", "post"],
    media: "https://media.snl.no/media/152213/standard_Erling_Braut_Haaland.jpg",
    created: "2023-01-17T15:44:32.419Z",
    updated: "2023-01-17T15:44:32.419Z",
    id: 2323,
    _count: {
      comments: 2,
      reactions: 4,
    },
  },
  {
    title: "Test Title 2, with tags!",
    body: "This is the body.",
    tags: ["tag1", "tag2"],
    media: "https://akamai.vgc.no/dredition-images/769/135/76913553/76913553-teaser-top-c8885d815ff2bff8c179fb998e1d76f3.jpg",
    created: "2023-01-13T16:15:12.315Z",
    updated: "2023-02-15T16:07:55.872Z",
    id: 2185,
    _count: {
      comments: 0,
      reactions: 3,
    },
  },
  {
    title: "Test Title",
    body: "This is some strange text put in the body, <br> with a HTML-tag inside it too.",
    tags: ["test"],
    media: "https://duet-cdn.vox-cdn.com/thumbor/0x0:2040x1360/640x427/filters:focal(1020x680:1021x681):format(webp)/cdn.vox-cdn.com/uploads/chorus_asset/file/24337220/1Z8A9447.jpg",
    created: "2023-01-13T16:14:41.924Z",
    updated: "2023-01-13T16:14:41.924Z",
    id: 2184,
    _count: {
      comments: 0,
      reactions: 2,
    },
  },
];

function Test() {
  const [allTags, setAllTags] = useState([]);
  //const tagsToShow = 10;

  useEffect(() => {
    function countTags() {
      let cummulatedTags = [];
      let counter = {};

      //Collects every tag and puts them in a array:
      testData.forEach((post) => {
        cummulatedTags = cummulatedTags.concat(post.tags);
      });
      //Creates a object with tagname as key, and number of occurences as value
      for (let tag of cummulatedTags.flat()) {
        if (counter[tag]) {
          counter[tag] += 1;
        } else {
          counter[tag] = 1;
        }
      }
      // Converts the above object to an array:
      const countedArr = Object.entries(counter);
      //console.log(countedArr);
      // Sorts the array based on number of occurences (index 0 = most):
      let sortedArr = countedArr.sort((tag1, tag2) => (tag1[1] < tag2[1] ? 1 : tag1[1] > tag2[1] ? -1 : 0));
      // Removes items that will not be presented to the user based on the defined variable.
      const filteredArray = sortedArr.filter((tag, index) => index < tagsToShow);
      // Sets the allTags-state with the data that will be presented.
      setAllTags(filteredArray);
    }

    countTags();
  }, []);

  return (
    <>
      <h2>Top {tagsToShow} Trending tags</h2>
      {allTags.map((tag, index) => (
        <p key={index} style={{ fontSize: `${12 + (22 - index * (22 / tagsToShow))}px` }}>
          {tag[0]} ({tag[1]})
        </p>
      ))}
    </>
  );
}
export default Test;
