

   

// Import ethers.js library
// Import ethers.js library



const App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadContract();
        // await App.render();
    },

    loadWeb3: async () => {
      if (window.web3) {
        App.provider = new ethers.providers.Web3Provider(window.ethereum)

// MetaMask requires requesting permission to connect users accounts
await App.provider.send("eth_requestAccounts", []);

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
App.account = App.provider.getSigner()
alert(`Hi ${App.account} `)
        
    } else {
            window.alert("Please connect to Metamask.");
        }
    },

    

    loadContract: async () => {
        // Replace 'YourContractABI' with the ABI of your CrowdFunding smart contract
        const contractABI =[
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectNumber",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_bidder",
                "type": "address"
              }
            ],
            "name": "acceptBid",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_skills",
                "type": "string"
              }
            ],
            "name": "addFreelancer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectNumber",
                "type": "uint256"
              }
            ],
            "name": "createProjectBid",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "freelancers",
            "outputs": [
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "skills",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "totalRatings",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalRaters",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectNumber",
                "type": "uint256"
              },
              {
                "internalType": "uint8",
                "name": "_n",
                "type": "uint8"
              }
            ],
            "name": "getBestBids",
            "outputs": [
              {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
              },
              {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
              },
              {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectNumber",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_bidAmount",
                "type": "uint256"
              }
            ],
            "name": "placeBid",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "projectBids",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "projectNumber",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "projectOwner",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "acceptedBidder",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_freelancer",
                "type": "address"
              },
              {
                "internalType": "uint8",
                "name": "_rating",
                "type": "uint8"
              }
            ],
            "name": "updateRatings",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ]
        
        // Replace 'YourContractAddress' with the address of your deployed CrowdFunding smart contract
        const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
        
        // Create a JavaScript version of the smart contract
        App.crowdFundingContract = new ethers.Contract(contractAddress, contractABI,App.provider);
    },
    createProfile: async () => {
      const username = document.getElementById('username').value;
      const skills = document.getElementById('skills').value;

      try {
          const tx = await App.crowdFundingContract.connect(App.account).addFreelancer(username, skills);
          await tx.wait();

          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = 'Profile created/updated successfully.';
          alert("Profile created/updated successfully.")
      } catch (error) {
          console.error(error);
      }
  },

  // Function for getting user profile
  // getUserProfile: async () => {
  //     const userAddress = document.getElementById('getUserAddress').value;

  //     try {
  //         const userProfile = await App.crowdFundingContract.getUserProfile(userAddress);
  //         const userProfileResult = document.getElementById('userProfileResult');
  //         userProfileResult.innerHTML = `<h3>User Profile:</h3>
  //         Username: ${userProfile.username}<br>
  //         Skills: ${userProfile.skills}`;
  //     } catch (error) {
  //         console.error(error);
  //     }
  // },

  // Function for updating user profile
  // updateProfile: async () => {
  //     const newUsername = document.getElementById('newUsername').value;
  //     const newSkills = document.getElementById('newSkills').value;

  //     try {
  //         const tx = await App.crowdFundingContract.updateUserProfile(newUsername, newSkills);
  //         await tx.wait();

  //         const updateResult = document.getElementById('updateResult');
  //         updateResult.innerHTML = 'Profile updated successfully.';
  //     } catch (error) {
  //         console.error(error);
  //     }
  // },

    createProjectBid: async () => {
      const projectId = parseInt(document.getElementById('projectid').value);

      try {
          // Call the Ethereum smart contract method to create a project bid
          const tx = await App.crowdFundingContract.connect(App.account).createProjectBid(projectId);
          await tx.wait();

          // const resultDiv = document.getElementById('projectBidResult');
          // resultDiv.innerHTML = 'Project bid created successfully.';
          alert("Profile bid created successfully.")
      } catch (error) {
          console.error(error);
      }
  },

  // Function for placing a bid on a project
  placeBid: async () => {
      const projectNumber = parseInt(document.getElementById('projectNumber').value);
      const bidAmount = parseInt(document.getElementById('bidAmount').value);

      try {
          // Call the Ethereum smart contract method to place a bid on a project
          const tx = await App.crowdFundingContract.connect(App.account).placeBid(projectNumber, bidAmount);
          await tx.wait();
alert("bid successful")
          // const resultDiv = document.getElementById('placeBidResult');
          // resultDiv.innerHTML = 'Bid placed successfully.';
      } catch (error) {
          console.error(error);
      }
  },

  // Function for accepting a bid for a project
  acceptBid: async () => {
      const projectNumber = parseInt(document.getElementById('acceptProjectNumber').value);
      const bidderAddress = document.getElementById('bidderAddress').value;

      try {
          // Call the Ethereum smart contract method to accept a bid for a project
          const tx = await App.crowdFundingContract.connect(App.account).acceptBid(projectNumber, bidderAddress);
          await tx.wait();

          // const resultDiv = document.getElementById('acceptBidResult');
          // resultDiv.innerHTML = 'Bid accepted successfully.';
          alert('Bid accepted')
      } catch (error) {
          console.error(error);
      }
  },

  // Function for updating ratings for a freelancer
  updateRatings: async () => {
      const freelancerAddress = document.getElementById('freelancerAddress').value;
      const rating = parseInt(document.getElementById('rating').value);

      try {
          // Call the Ethereum smart contract method to update ratings for a freelancer
          const tx = await App.crowdFundingContract.connect(App.account).updateRatings(freelancerAddress, rating);
          await tx.wait();

          // const resultDiv = document.getElementById('updateRatingsResult');
          // resultDiv.innerHTML = 'Ratings updated successfully.';
          alert('Updated ratings')
      } catch (error) {
          console.error(error);
      }
  },

  getBestBids: async () => {
    const projectNumber = parseInt(document.getElementById('projectNumberForBestBids').value);
    const n = parseInt(document.getElementById('numberOfBestBids').value);

    try {
      
        // Call the Ethereum smart contract method to get the best bids
        const tx = await App.crowdFundingContract.connect(App.account).getBestBids(projectNumber, n);
        res=await tx.wait();
        console.log(res)
        // Display the results
        // const resultDiv = document.getElementById('bestBidsResult');
        // resultDiv.innerHTML = '<h3>Best Bids:</h3>';
        // for (let i = 0; i < result[0].length; i++) {
        //     resultDiv.innerHTML += `Bidder Address: ${result[0][i]}<br>`;
        //     resultDiv.innerHTML += `Bid Amount (in wei): ${result[1][i]}<br>`;
        //     resultDiv.innerHTML += `Skills: ${result[2][i]}<br><br>`;
        // }
    } catch (error) {
        console.error(error);
    }
},





    // render: async () => {
    //     // Prevent double render
    //     if (App.loading) {
    //         return;
    //     }

    //     // Update app loading state
    //     App.setLoading(true);

    //     // Render Account
    //     $('#account').html(App.account);

        

    //     // Update loading state
    //     App.setLoading(false);
    // },
   
// createProfile: async()=>{
  
//         const username = document.getElementById('username').value;
//         const skills = document.getElementById('skills').value;

//         try {
//             const tx = await App.crowdFundingContract.connect(App.account).createUserProfile(username, skills);
//             await tx.wait();

//             const resultDiv = document.getElementById('result');
//             resultDiv.innerHTML = 'Profile created/updated successfully.';
//         } catch (error) {
//             console.error(error);
//         }
//     ;
// },
// // Add this function to your existing app.js file
//  getUserProfile : async () => {
//     const userAddress = document.getElementById('getUserAddress').value;

//     try {
//         const userProfile = await App.crowdFundingContract.connect(App.account).getUserProfile(userAddress);
   

//         const userProfileResult = document.getElementById('userProfileResult');
//         userProfileResult.innerHTML = `
//             <strong>Username:</strong> ${userProfile[0]}<br>
//             <strong>Skills:</strong> ${userProfile[1]}<br>
//             <strong>Ratings:</strong> ${userProfile[2]}
//         `;
//     } catch (error) {
//         console.error(error);
//     }
// },
// updateProfile : async () =>{
   
//         const newUsername = document.getElementById('newUsername').value;
//         const newSkills = document.getElementById('newSkills').value;

//         try {
//             const tx = await App.crowdFundingContract.connect(App.account).updateProfile(newUsername, newSkills);
//             await tx.wait();

//             const updateResultDiv = document.getElementById('updateResult');
//             updateResultDiv.innerHTML = 'Profile updated successfully.';
//         } catch (error) {
//             console.error(error);
//         }

// }

// setLoading: (boolean) => {
//     App.loading = boolean;
//     const loader = $('#loader');
//     const content = $('#content');
//     if (boolean) {
//         loader.show();
//         content.hide();
//     } else {
//         loader.hide();
//         content.show();
//     }
// }

};

$(() => {
    $(window).load(() => {
        App.load();
    });
});
