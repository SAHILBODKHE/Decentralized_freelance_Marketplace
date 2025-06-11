

   

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
                "name": "_arbitrationPeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_decisionPeriod",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "arbitrationId",
                "type": "uint256"
              }
            ],
            "name": "ArbitrationInitiated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "arbitrationId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "bool",
                "name": "accepted",
                "type": "bool"
              }
            ],
            "name": "ArbitrationResolved",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              }
            ],
            "name": "MilestoneApproved",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              }
            ],
            "name": "MilestoneCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "initiator",
                "type": "address"
              }
            ],
            "name": "MilestoneDisputeInitiated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "disputeId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "arbitrator",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "bool",
                "name": "decision",
                "type": "bool"
              }
            ],
            "name": "MilestoneDisputeResolved",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
              }
            ],
            "name": "MilestoneProposalSubmitted",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              }
            ],
            "name": "MilestoneRejected",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              }
            ],
            "name": "MilestoneSubmitted",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              }
            ],
            "name": "ProjectCompleted",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "employer",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "budget",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              }
            ],
            "name": "ProjectCreated",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_freelancer",
                "type": "address"
              }
            ],
            "name": "addFreelancerToProject",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
              }
            ],
            "name": "approveMilestone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "arbitrationPeriod",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
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
                "name": "_milestoneId",
                "type": "uint256"
              }
            ],
            "name": "autoApproveMilestone",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
              }
            ],
            "name": "autoTransferFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
              }
            ],
            "name": "createMilestone",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_title",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_budget",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
              }
            ],
            "name": "createProject",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "decisionPeriod",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
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
                "name": "_disputeId",
                "type": "uint256"
              }
            ],
            "name": "getDispute",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "disputeId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "initiator",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "evidence",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
              }
            ],
            "name": "getMilestone",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "enum CombinedContract.MilestoneStatus",
                "name": "status",
                "type": "uint8"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
              }
            ],
            "name": "getMilestoneProposal",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "workProof",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "comments",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_evidence",
                "type": "string"
              }
            ],
            "name": "initiateDispute",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "numArbitrationCases",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "numDisputes",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "numMilestoneProposals",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "numMilestones",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "numProjects",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
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
            "name": "projects",
            "outputs": [
              {
                "internalType": "address",
                "name": "employer",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "budget",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "creationTime",
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
                "name": "_milestoneId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_reason",
                "type": "string"
              }
            ],
            "name": "rejectMilestone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "_accepted",
                "type": "bool"
              }
            ],
            "name": "resolveArbitration",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_disputeId",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "_decision",
                "type": "bool"
              }
            ],
            "name": "resolveDispute",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_milestoneId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "_workProof",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_comments",
                "type": "string"
              }
            ],
            "name": "submitMilestone",
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

    render: async () => {
        // Prevent double render
        if (App.loading) {
            return;
        }

        // Update app loading state
        App.setLoading(true);

        // Render Account
        $('#account').html(App.account);

        

        // Update loading state
        App.setLoading(false);
    },

// Function to create a project
createProject:async()=> {
  const title = document.getElementById('createProjectTitle').value;
  const budget = parseInt(document.getElementById('createProjectBudget').value);
  const deadline = parseInt(document.getElementById('createProjectDeadline').value);

  try {
      // Call the Ethereum smart contract method to create a project
      const tx = await  App.crowdFundingContract.connect(App.account).createProject(title, budget, deadline);
      await tx.wait();

      alert('Project created successfully.');
  } catch (error) {
      console.error(error);
      alert('Project creation failed. Please check the input and try again.');
  }
},

// Function to add a freelancer to a project
addFreelancerToProject:async()=> {
  const milestoneId = parseInt(document.getElementById('addFreelancerMilestoneId').value);
  const freelancerAddress = document.getElementById('addFreelancerAddress').value;

  try {
      // Call the Ethereum smart contract method to add a freelancer to a project
      const tx = await  App.crowdFundingContract.connect(App.account).addFreelancerToProject(milestoneId, freelancerAddress);
      await tx.wait();

      alert('Freelancer added to the project successfully.');
  } catch (error) {
      console.error(error);
      alert('Failed to add the freelancer to the project. Please check the input and try again.');
  }
},

// Function to create a milestone
createMilestone:async()=> {
 try {
  const amount = prompt('Enter the amount to donate:');
    if (amount) {
    
      // Convert the amount to ethers
      const ethersAmount = ethers.utils.parseEther(amount);
      const projectId = parseInt(document.getElementById('createMilestoneProjectId').value);
      const description = document.getElementById('createMilestoneDescription').value;
      const deadline = parseInt(document.getElementById('createMilestoneDeadline').value);
      // Call the smart contract function to donate
     

     
      // You can update the UI or display a success message here
  
      // Call the Ethereum smart contract method to create a milestone
      const tx = await  App.crowdFundingContract.connect(App.account).createMilestone(projectId, description, deadline,{ value:ethersAmount })
     
      await tx.wait();
      console.log('Donation successful:', tx);
      alert('Milestone created successfully.');}
  }
  catch (error) {
    console.error('Error donating:', error);
    // Handle the error and display an error message to the user
  }
},

// Function to submit a milestone
submitMilestone:async()=> {
  const milestoneId = parseInt(document.getElementById('submitMilestoneId').value);
  const workProof = document.getElementById('submitMilestoneWorkProof').value;
  const comments = document.getElementById('submitMilestoneComments').value;

  try {
      // Call the Ethereum smart contract method to submit a milestone
      const tx = await  App.crowdFundingContract.connect(App.account).submitMilestone(milestoneId, workProof, comments);
      await tx.wait();

      alert('Milestone submitted successfully.');
  } catch (error) {
      console.error(error);
      alert('Milestone submission failed. Please check the input and try again.');
  }
}
,
// Function to approve a milestone
approveMilestone:async()=>{
  const milestoneId = parseInt(document.getElementById('approveMilestoneId').value);

  try {
      // Call the Ethereum smart contract method to approve a milestone
      const tx = await  App.crowdFundingContract.connect(App.account).approveMilestone(milestoneId);
      await tx.wait();

      alert('Milestone approved successfully.');
  } catch (error) {
      console.error(error);
      alert('Milestone approval failed. Please check the input and try again.');
  }
},

// Function to reject a milestone
rejectMilestone:async()=>{
  const milestoneId = parseInt(document.getElementById('rejectMilestoneId').value);
  const reason = document.getElementById('rejectMilestoneReason').value;

  try {
      // Call the Ethereum smart contract method to reject a milestone
      const tx = await  App.crowdFundingContract.connect(App.account).rejectMilestone(milestoneId, reason);
      await tx.wait();

      alert('Milestone rejected successfully.');
  } catch (error) {
      console.error(error);
      alert('Milestone rejection failed. Please check the input and try again.');
  }
},

// Function to initiate a dispute
initiateDispute:async()=> {
  const milestoneId = parseInt(document.getElementById('initiateDisputeMilestoneId').value);
  const evidence = document.getElementById('initiateDisputeEvidence').value;

  try {
      // Call the Ethereum smart contract method to initiate a dispute
      const tx = await  App.crowdFundingContract.connect(App.account).initiateDispute(milestoneId, evidence);
      await tx.wait();

      alert('Dispute initiated successfully.');
  } catch (error) {
      console.error(error);
      alert('Dispute initiation failed. Please check the input and try again.');
  }
},

// Function to resolve a dispute
resolveDispute:async()=> {
  const disputeId = parseInt(document.getElementById('resolveDisputeId').value);
  const decision = document.getElementById('resolveDisputeDecision').value === 'true';

  try {
      // Call the Ethereum smart contract method to resolve a dispute
      const tx = await  App.crowdFundingContract.connect(App.account).resolveDispute(disputeId, decision);
      await tx.wait();

      alert('Dispute resolved successfully.');
  } catch (error) {
      console.error(error);
      alert('Dispute resolution failed. Please check the input and try again.');
  }
},

// Function to auto-approve a milestone
autoApproveMilestone:async()=>{
  const milestoneId = parseInt(document.getElementById('autoApproveMilestoneId').value);

  try {
      // Call the Ethereum smart contract method to auto-approve a milestone
      const tx = await  App.crowdFundingContract.connect(App.account).autoApproveMilestone(milestoneId);
      await tx.wait();

      alert('Milestone auto-approved successfully.');
  } catch (error) {
      console.error(error);
      alert('Milestone auto-approval failed. Please check the input and try again.');
  }
},

// Function to initiate arbitration
initiateArbitration:async()=> {
  const projectId = parseInt(document.getElementById('initiateArbitrationProjectId').value);
  const freelancerAddress = document.getElementById('initiateArbitrationFreelancerAddress').value;
  const description = document.getElementById('initiateArbitrationDescription').value;

  try {
      // Call the Ethereum smart contract method to initiate arbitration
      const tx = await  App.crowdFundingContract.connect(App.account).initiateArbitration(projectId, freelancerAddress, description);
      await tx.wait();

      alert('Arbitration initiated successfully.');
  } catch (error) {
      console.error(error);
      alert('Arbitration initiation failed. Please check the input and try again.');
  }
},

// Function to resolve arbitration
resolveArbitration:async ()=> {
  const projectId = parseInt(document.getElementById('resolveArbitrationProjectId').value);
  const accepted = document.getElementById('resolveArbitrationAccepted').value === 'true';

  try {
      // Call the Ethereum smart contract method to resolve arbitration
      const tx = await  App.crowdFundingContract.connect(App.account).resolveArbitration(projectId, accepted);
      await tx.wait();

      alert('Arbitration resolved successfully.');
  } catch (error) {
      console.error(error);
      alert('Arbitration resolution failed. Please check the input and try again.');
  }
},

// Function to auto-transfer funds
autoTransferFunds : async ()=> {
  const projectId = parseInt(document.getElementById('autoTransferFundsProjectId').value);

  try {
      // Call the Ethereum smart contract method to auto-transfer funds
      const tx = await  App.crowdFundingContract.connect(App.account).autoTransferFunds(projectId);
      await tx.wait();

      alert('Funds auto-transferred successfully.');
  } catch (error) {
      console.error(error);
      alert('Funds auto-transfer failed. Please check the input and try again.');
  }
},


   
//     createMilestone: async () => {
//         const projectId = parseInt(document.getElementById('projectId').value);
//         const description = document.getElementById('description').value;
        
//         const amount = parseInt(document.getElementById('amount').value);
//         console.log(amount)
    
//         try {
//             // Call the Ethereum smart contract method to create a milestone
//             const tx = await App.crowdFundingContract.connect(App.account).createMilestone(projectId, description, amount);
//             await tx.wait();
    
//             const resultDiv = document.getElementById('result');
//             resultDiv.innerHTML = 'Milestone created successfully.';
//         } catch (error) {
//             console.error(error);
//             alert("Milestone creation failed. Please check the input and try again.");
//         }
//     }
// ,    
// createProject: async () => {
//     const title = document.getElementById('title').value;
//     const budget = parseInt(document.getElementById('budget').value);
//     const deadline = new Date(document.getElementById('deadline').value).getTime() / 1000; // Convert to Unix timestamp

//     try {
//         // Call the Ethereum smart contract method to create a project
//         const tx = await App.crowdFundingContract.connect(App.account).createProject(title, budget, deadline);
//         await tx.wait();

//         const resultDiv = document.getElementById('result');
//         resultDiv.innerHTML = 'Project created successfully.';
//     } catch (error) {
//         console.error(error);
//     }
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
