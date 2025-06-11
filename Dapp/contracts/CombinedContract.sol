// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CombinedContract {
    address public owner;
    uint public arbitrationPeriod;
    uint public decisionPeriod;

    enum MilestoneStatus { Created, Submitted, Approved, Rejected }

    struct Milestone {
        uint256 id;
        uint256 projectId;
        address employer;
        address freelancer;
        string description;
        uint256 deadline;
        uint256 amount;
        MilestoneStatus status;
    }

    struct MilestoneProposal {
        uint256 milestoneId;
        address freelancer;
        string workProof;
        string comments;
    }

    struct Dispute {
        uint256 disputeId;
        uint256 milestoneId;
        address initiator; // Either employer or freelancer
        string evidence;
        bool resolved;
    }

    struct Project {
        address employer;
        address freelancer;
        string title;
        uint budget;
        uint deadline;
        bool completed;
        uint creationTime;
    }

    struct ArbitrationCase {
        address freelancer;
        uint projectId;
        string description;
        uint arbitrationDeadline;
        bool resolved;
    }

    mapping(uint => Project) public projects;
    mapping(uint => Milestone) private  milestones;
    mapping(uint => MilestoneProposal) private milestoneProposals;
    mapping(uint => Dispute) private disputes;
    mapping(uint => ArbitrationCase) private arbitrationCases;
    uint public numProjects;
    uint public numMilestones;
    uint public numMilestoneProposals;
    uint public numDisputes;
    uint public numArbitrationCases;

    event ProjectCreated(uint indexed projectId, address indexed employer, string title, uint budget, uint deadline);
    event ProjectCompleted(uint indexed projectId);
    event MilestoneCreated(uint256 indexed milestoneId, uint256 indexed projectId);
    event MilestoneSubmitted(uint256 indexed milestoneId);
    event MilestoneApproved(uint256 indexed milestoneId);
    event MilestoneRejected(uint256 indexed milestoneId);
    event MilestoneProposalSubmitted(uint256 indexed milestoneId, address indexed freelancer);
    event MilestoneDisputeInitiated(uint256 indexed milestoneId, address indexed initiator);
    event MilestoneDisputeResolved(uint256 indexed disputeId, address indexed arbitrator, bool decision);
    event ArbitrationInitiated(uint indexed projectId, uint indexed arbitrationId);
    event ArbitrationResolved(uint indexed projectId, uint indexed arbitrationId, bool accepted);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(uint _arbitrationPeriod, uint _decisionPeriod) {
        owner = msg.sender;
        arbitrationPeriod = _arbitrationPeriod;
        decisionPeriod = _decisionPeriod;
    }

    function createProject(string memory _title, uint _budget, uint _deadline) external {
        require(_budget > 0, "Budget must be greater than zero");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Project storage project = projects[numProjects];
        project.employer = msg.sender;
        project.title = _title;
        project.budget = _budget;
        project.deadline = _deadline;
        project.completed = false;
        project.creationTime = block.timestamp;

        emit ProjectCreated(numProjects, msg.sender, _title, _budget, _deadline);
        numProjects++;
    }
function addFreelancerToProject(uint _projectId, address _freelancer) external {
    Project storage project = projects[_projectId];
    require(msg.sender == project.employer, "Only the project employer can add a freelancer to the project");
    require(project.completed == false, "Freelancer cannot be added to a completed project");

    // Ensure the provided freelancer address is not the zero address.
    require(_freelancer != address(0), "Invalid freelancer address");

    // Set the freelancer address for the project.
    project.freelancer = _freelancer;
}

function createMilestone(uint256 _projectId, string memory _description, uint256 _deadline) external payable {
    address employer = projects[_projectId].employer;
    require(msg.sender == employer, "Only the project employer can call this function.");
    
    //  require(msg.value >=_amount-, "Value should as per amount.");
    // Create the milestone with the transferred funds.
    milestones[numMilestones] = Milestone(numMilestones, _projectId, employer, projects[_projectId].freelancer, _description, _deadline,msg.value, MilestoneStatus.Created);
    emit MilestoneCreated(numMilestones, _projectId);
    numMilestones++;
}


    function submitMilestone(uint256 _milestoneId, string memory _workProof, string memory _comments) external {
        Milestone storage milestone = milestones[_milestoneId];
        require(msg.sender == milestone.freelancer, "Only the freelancer can call this function.");
        require(milestone.status == MilestoneStatus.Created, "Milestone has already been submitted or processed.");
        milestone.status = MilestoneStatus.Submitted;
        milestone.freelancer = msg.sender;
        emit MilestoneSubmitted(_milestoneId);
        milestoneProposals[numMilestoneProposals] = MilestoneProposal(_milestoneId, msg.sender, _workProof, _comments);
        emit MilestoneProposalSubmitted(_milestoneId, msg.sender);
        numMilestoneProposals++;
    }

    function approveMilestone(uint256 _milestoneId) external   {
        Milestone storage milestone = milestones[_milestoneId];
        require(msg.sender == projects[milestone.projectId].employer, "Only the project employer can call this function.");
        require(milestone.status == MilestoneStatus.Submitted, "Milestone is not in the Submitted state.");
        require(block.timestamp <= milestone.deadline + decisionPeriod, "Decision period has passed.");
        milestone.status = MilestoneStatus.Approved;
        uint256 amountToRelease = milestone.amount;
        payable(milestone.freelancer).transfer(amountToRelease);
        emit MilestoneApproved(_milestoneId);
    }

    function rejectMilestone(uint256 _milestoneId, string memory _reason) external {
        Milestone storage milestone = milestones[_milestoneId];
        require(msg.sender == projects[milestone.projectId].employer, "Only the project employer can call this function.");
        require(milestone.status == MilestoneStatus.Submitted, "Milestone is not in the Submitted state.");
        milestone.status = MilestoneStatus.Rejected;
        emit MilestoneRejected(_milestoneId);
        initiateDispute(_milestoneId, _reason);
    }

    function initiateDispute(uint256 _milestoneId, string memory _evidence) public {
        Milestone storage milestone = milestones[_milestoneId];
        require(msg.sender == milestone.employer || msg.sender == milestone.freelancer, "Only the project employer or freelancer can initiate a dispute.");
        require(milestone.status == MilestoneStatus.Rejected, "Dispute can only be initiated for rejected milestones.");
        disputes[numDisputes] = Dispute(numDisputes, _milestoneId, msg.sender, _evidence, false);
        emit MilestoneDisputeInitiated(_milestoneId, msg.sender);
        numDisputes++;
    }

    function resolveDispute(uint256 _disputeId, bool _decision) external {
        Dispute storage dispute = disputes[_disputeId];
        require(!dispute.resolved, "Dispute has already been resolved.");
        dispute.resolved = true;
        emit MilestoneDisputeResolved(_disputeId, msg.sender, _decision);
        if (_decision) {
            uint256 milestoneId = dispute.milestoneId;
            uint256 amountToRelease = milestones[milestoneId].amount;
            payable(milestones[milestoneId].freelancer).transfer(amountToRelease);
        }
    }

    function autoApproveMilestone(uint256 _milestoneId) external payable  {
        Milestone storage milestone = milestones[_milestoneId];
         require(msg.sender == projects[milestone.projectId].freelancer, "Only the project employer can call this function.");
        require(milestone.status == MilestoneStatus.Submitted, "Milestone is not in the Submitted state.");
        require(block.timestamp > milestone.deadline + decisionPeriod, "Decision period has not passed.");
        milestone.status = MilestoneStatus.Approved;
        uint256 amountToRelease = milestone.amount;
        payable(milestone.freelancer).transfer(amountToRelease);
        emit MilestoneApproved(_milestoneId);
    }

    function getMilestone(uint256 _milestoneId) external view returns (
        uint256 id,
        uint256 projectId,
        address employer,
        address freelancer,
        string memory description,
        uint256 deadline,
        uint256 amount,
        MilestoneStatus status
    ) {
        Milestone storage milestone = milestones[_milestoneId];
        require(msg.sender == milestone.employer || msg.sender == milestone.freelancer, "Only the employer or participant can access this function.");
        return (
            milestone.id,
            milestone.projectId,
            milestone.employer,
            milestone.freelancer,
            milestone.description,
            milestone.deadline,
            milestone.amount,
            milestone.status
        );
    }

    function getMilestoneProposal(uint256 _milestoneId) external view returns (
        uint256 milestoneId,
        address freelancer,
        string memory workProof,
        string memory comments
    ) {
        MilestoneProposal memory proposal;
        for (uint256 i = 1; i <= numMilestoneProposals; i++) {
            if (milestoneProposals[i].milestoneId == _milestoneId) {
                proposal = milestoneProposals[i];
                break;
            }
        }
        return (
            proposal.milestoneId,
            proposal.freelancer,
            proposal.workProof,
            proposal.comments
        );
    }

    function getDispute(uint256 _disputeId) external view returns (
        uint256 disputeId,
        uint256 milestoneId,
        address initiator,
        string memory evidence,
        bool resolved
    ) {
        Dispute storage dispute = disputes[_disputeId];
        return (
            dispute.disputeId,
            dispute.milestoneId,
            dispute.initiator,
            dispute.evidence,
            dispute.resolved
        );
    }

    function initiateArbitration(uint _projectId, address _freelancer, string memory _description) internal {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(!_isProjectCompleted(_projectId), "Arbitration can only be initiated for completed projects");

        ArbitrationCase storage arbitrationCase = arbitrationCases[numArbitrationCases];
        arbitrationCase.freelancer = _freelancer;
        arbitrationCase.projectId = _projectId;
        arbitrationCase.description = _description;
        arbitrationCase.arbitrationDeadline = block.timestamp + arbitrationPeriod;
        arbitrationCase.resolved = false;

        emit ArbitrationInitiated(_projectId, numArbitrationCases);
        numArbitrationCases++;
    }

    function resolveArbitration(uint _projectId, bool _accepted) external onlyOwner {
        ArbitrationCase storage arbitrationCase = arbitrationCases[_projectId];
        require(!arbitrationCase.resolved, "Arbitration is already resolved");
        require(block.timestamp > arbitrationCase.arbitrationDeadline, "Arbitration deadline has not passed yet");

        if (_accepted) {
            projects[arbitrationCase.projectId].completed = true;
            emit ProjectCompleted(arbitrationCase.projectId);
        }

        emit ArbitrationResolved(arbitrationCase.projectId, _projectId, _accepted);

        arbitrationCase.resolved = true;
    }

    function autoTransferFunds(uint _projectId) external {
        Project storage project = projects[_projectId];
        require(!_isProjectCompleted(_projectId), "Project is already completed");
        require(block.timestamp > project.deadline + arbitrationPeriod, "Deadline has not passed yet");

        project.completed = true;
        emit ProjectCompleted(_projectId);
    }

    function _isProjectCompleted(uint _projectId) internal view returns (bool) {
        return projects[_projectId].completed;
    }
}
