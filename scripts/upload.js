// const { create } = require("ipfs-http-client");

// const ipfs = create("https://ipfs.infura.io:5001");

// // we added two attributes, add as many as you want!
// async function run() {
//   const files = [{
//     path: '/',
//     content: JSON.stringify({
//       name: "Complexion",
//       attributes: [
//         {
//           "trait_type": "Red",
//           "value": "100"
//         },
//         {
//           "trait_type": "Blue",
//           "value": "100"
//         },
//         {
//           "trait_type": "Green",
//           "value": "100"
//         },
//         {
//           "trait_type": "Yellow",
//           "value": "100"
//         }
//       ],

//       image: "https://gateway.pinata.cloud/ipfs/QmbsG5PECKo7FGJ7t5wkq3jdqJ3fYqjnhZcgUWHRADit4M/Red.png",
//       description: "Red"
//     })
//   }];

//   const result = await ipfs.add(files);
//   console.log(result);
// }

// run();