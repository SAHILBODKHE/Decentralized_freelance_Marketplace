// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectContract {
    address public owner;
    uint public arbitrationPeriod; // Arbitration period in seconds

    enum MilestoneStatus { Pending, Approved, Rejected }

    // Add a constant to define the milestone approval period (e.g., 2 days)
    uint constant MILESTONE_APPROVAL_PERIOD = 2 days;

    struct Project {
        address employer;
        string title;
        uint budget;
        uint deadline;
        uint numMilestones;
        mapping(uint => Milestone) milestones;
        bool completed;
        uint creationTime;
    }

    struct Milestone {
        string description;
        uint amount;
        MilestoneStatus status;
        uint submissionTime;
        string rejectionReason;
    }

    struct ArbitrationCase {
        address freelancer;
        uint projectId;
        string description;
        uint arbitrationDeadline;
        bool resolved;
    }

    mapping(uint => Project) public projects;
    mapping(uint => ArbitrationCase) public arbitrationCases;
    uint public numProjects;
    uint public numArbitrationCases;

    event ProjectCreated(uint indexed projectId, address indexed employer, string title, uint budget, uint deadline);
    event MilestoneCreated(uint indexed projectId, uint indexed milestoneId, string description, uint amount);
    event MilestoneSubmitted(uint indexed projectId, uint indexed milestoneId);
    event MilestoneApproved(uint indexed projectId, uint indexed milestoneId);
    event MilestoneRejected(uint indexed projectId, uint indexed milestoneId, string rejectionReason);
    event ProjectCompleted(uint indexed projectId);
    event ArbitrationInitiated(uint indexed projectId, uint indexed arbitrationId);
    event ArbitrationResolved(uint indexed projectId, uint indexed arbitrationId, bool accepted);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(uint _arbitrationPeriod) {
        owner = msg.sender;
        arbitrationPeriod = _arbitrationPeriod;
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

    function createMilestone(uint _projectId, string memory _description, uint _amount) external onlyOwner {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only the employer can create milestones");
        require(!_isProjectCompleted(_projectId), "Project is already completed");
        require(_amount > 0 && _amount <= project.budget, "Invalid milestone amount");

        Milestone storage milestone = project.milestones[project.numMilestones];
        milestone.description = _description;
        milestone.amount = _amount;
        milestone.status = MilestoneStatus.Pending;

        emit MilestoneCreated(_projectId, project.numMilestones, _description, _amount);
        project.numMilestones++;
    }

    function submitMilestone(uint _projectId, uint _milestoneId) external {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        require(!_isProjectCompleted(_projectId), "Project is already completed");
        require(msg.sender != project.employer, "Employer cannot submit milestones");
        require(milestone.status == MilestoneStatus.Pending, "Milestone is not pending");

        milestone.status = MilestoneStatus.Pending;
        milestone.submissionTime = block.timestamp;

        emit MilestoneSubmitted(_projectId, _milestoneId);
    }

    function approveMilestone(uint _projectId, uint _milestoneId) external onlyOwner {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        require(!_isProjectCompleted(_projectId), "Project is already completed");
        require(msg.sender == project.employer, "Only the employer can approve milestones");
        require(milestone.status == MilestoneStatus.Pending, "Milestone is not pending");

        // Check if the milestone approval period has passed
        require(block.timestamp >= milestone.submissionTime + MILESTONE_APPROVAL_PERIOD, "Milestone approval period has not passed yet");

        milestone.status = MilestoneStatus.Approved;

        emit MilestoneApproved(_projectId, _milestoneId);

        // Check if all milestones are approved to mark the project as completed
        if (_allMilestonesApproved(_projectId)) {
            project.completed = true;
            emit ProjectCompleted(_projectId);
        }
    }

    function rejectMilestone(uint _projectId, uint _milestoneId, string memory _rejectionReason) external onlyOwner {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneId];
        require(!_isProjectCompleted(_projectId), "Project is already completed");
        require(msg.sender == project.employer, "Only the employer can reject milestones");
        require(milestone.status == MilestoneStatus.Pending, "Milestone is not pending");

        milestone.status = MilestoneStatus.Rejected;
        milestone.rejectionReason = _rejectionReason;

        emit MilestoneRejected(_projectId, _milestoneId, _rejectionReason);

        initiateArbitration(_projectId, msg.sender, _rejectionReason);
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

    function _allMilestonesApproved(uint _projectId) internal view returns (bool) {
        Project storage project = projects[_projectId];
        for (uint i = 0; i < project.numMilestones; i++) {
            if (project.milestones[i].status != MilestoneStatus.Approved) {
                return false;
            }
        }
        return true;
    }
}
