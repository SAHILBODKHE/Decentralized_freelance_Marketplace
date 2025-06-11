// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelancerPlatform {
    struct Freelancer {
        string name;
        string skills; // Store skills as a single string
        uint256 totalRatings;
        uint256 totalRaters;
        mapping(address => uint8) ratings;
    }

    struct ProjectBid {
        uint256 projectNumber;
        address projectOwner;
        address[] bidders;
        address acceptedBidder; // Store the address of the accepted bidder
        mapping(address => uint256) bidAmounts; // Store bid amounts by bidder
    }

    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => ProjectBid) public projectBids;

    // Add a freelancer to the platform
    function addFreelancer(string memory _name, string memory _skills) public {
        freelancers[msg.sender].name = _name;
        freelancers[msg.sender].skills = _skills;
    }

    // Update freelancer ratings by project owner
    function updateRatings(address _freelancer, uint8 _rating) public {
        require(freelancers[msg.sender].ratings[_freelancer] == 0, "Rating already provided");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        freelancers[_freelancer].ratings[msg.sender] = _rating;
        freelancers[_freelancer].totalRatings += _rating;
        freelancers[_freelancer].totalRaters++;
    }

    // Create a project bid
    function createProjectBid(uint256 _projectNumber) public {
        projectBids[_projectNumber].projectNumber = _projectNumber;
        projectBids[_projectNumber].projectOwner = msg.sender;
    }

    // Bid for a project with a bid amount
    function placeBid(uint256 _projectNumber, uint256 _bidAmount) public {
        require(projectBids[_projectNumber].projectOwner != address(0), "Project not found");
        projectBids[_projectNumber].bidders.push(msg.sender);
        
        // Store the bid amount for this bidder and project
        projectBids[_projectNumber].bidAmounts[msg.sender] = _bidAmount;
    }

    // Accept a bid for a project
    function acceptBid(uint256 _projectNumber, address _bidder) public {
        ProjectBid storage project = projectBids[_projectNumber];
        require(project.projectOwner == msg.sender, "Only the project owner can accept bids");
        require(project.acceptedBidder == address(0), "Bid has already been accepted");

        bool isValidBidder = false;
        for (uint256 i = 0; i < project.bidders.length; i++) {
            if (project.bidders[i] == _bidder) {
                isValidBidder = true;
                break;
            }
        }

        require(isValidBidder, "The specified bidder is not in the list of bidders");

        project.acceptedBidder = _bidder;
    }

    // Get N best bids based on user ratings along with bid amounts and skills
    function getBestBids(uint256 _projectNumber, uint8 _n) public  returns (address[] memory, uint256[] memory, string[] memory) {
        ProjectBid storage project = projectBids[_projectNumber];
        require(project.projectOwner == msg.sender, "Only the project owner can view the best bids");

        address[] storage bidders = project.bidders;

        require(bidders.length >= _n, "Not enough bidders for N");

        // Create arrays to store bidder ratings and bid amounts
        uint8[] memory bidderRatings = new uint8[](bidders.length);
        uint256[] memory bidAmounts = new uint256[](bidders.length);

        for (uint256 i = 0; i < bidders.length; i++) {
            address bidder = bidders[i];
            bidderRatings[i] = freelancers[project.projectOwner].ratings[bidder];
            bidAmounts[i] = project.bidAmounts[bidder];
        }

        // Sort bidders in descending order of ratings
        for (uint256 i = 0; i < bidders.length - 1; i++) {
            for (uint256 j = i + 1; j < bidders.length; j++) {
                if (bidderRatings[i] < bidderRatings[j]) {
                    (bidderRatings[i], bidderRatings[j]) = (bidderRatings[j], bidderRatings[i]);
                    (bidders[i], bidders[j]) = (bidders[j], bidders[i]);
                    (bidAmounts[i], bidAmounts[j]) = (bidAmounts[j], bidAmounts[i]);
                }
            }
        }

        // Concatenate skills into a single string
        string[] memory skillz = new string[](_n);

        address[] memory bestBidders = new address[](_n);
        uint256[] memory bestBidAmounts = new uint256[](_n);
    
        for (uint8 j = 0; j < _n; j++) {
            bestBidders[j] = bidders[j];
            bestBidAmounts[j] = bidAmounts[j];
            skillz[j]=freelancers[bestBidders[j]].skills;

        }
    
        return (bestBidders, bestBidAmounts, skillz);
    }
}
