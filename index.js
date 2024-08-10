// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  // Check if the assignment group belongs to the course.
  function isValidCourseAssignmentGroup(CourseInfo, AssignmentGroup) {
    return CourseInfo.id === AssignmentGroup.course_id;
  }
  
  // Check if a learner's submission is valid.
  function isValidSubmission(submission, assignment) {
    const score = submission.submission.score;
    const pointsPossible = assignment.points_possible;
  
    return pointsPossible > 0 && typeof score === "number" && !isNaN(score);
  }
  
  // Calculate the weighted average of a learner's scores.
  function calculateWeightedAverage(learnerData) {
    return (learnerData.totalScore / learnerData.totalWeight) * 100;
  }
  
  // Process learner data, calculate scores, and return the results.
  function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
    if (!isValidCourseAssignmentGroup(CourseInfo, AssignmentGroup)) {
      throw new Error("Invalid input: AssignmentGroup does not belong to the course.");
    }
  
    const assignments = AssignmentGroup.assignments;
  
    // Step 1: Build a map of learners and their submissions
    const learnerMap = {};
    LearnerSubmissions.forEach(submission => {
      const learnerID = submission.learner_id;
      if (!learnerMap[learnerID]) {
        learnerMap[learnerID] = [];
      }
      learnerMap[learnerID].push(submission);
    });
  
    // Step 2: Grade each learner’s submissions and calculate scores
    const learnerData = Object.keys(learnerMap).map(learnerID => {
      const submissions = learnerMap[learnerID];
      let totalScore = 0;
      let totalWeight = 0;
  
      submissions.forEach(submission => {
        const assignmentID = submission.assignment_id;
        const assignment = assignments.find(a => a.id === assignmentID);
  
        if (!assignment) {
          console.error(`Assignment with ID ${assignmentID} not found.`);
          return;
        }
  
        const submittedAt = new Date(submission.submission.submitted_at);
        const dueAt = new Date(assignment.due_at);
  
        // Omit late submissions
        if (submittedAt > dueAt) {
          return;
        }
  
        if (isValidSubmission(submission, assignment)) {
          const score = submission.submission.score;
          const pointsPossible = assignment.points_possible;
          totalScore += score;
          totalWeight += pointsPossible;
        }
      });
  
      return {
        id: learnerID,
        avg: totalWeight > 0 ? calculateWeightedAverage({ totalScore, totalWeight }) : 0
      };
    });
  
    return learnerData;
  }
  
  // Get learner data, including scores and averages.
  function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
    try {
      const learnerData = processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
      // Return formatted results
      return learnerData;
  
    } catch (error) {
      console.error("An error occurred:", error.message);
      return [];
    }
  }
  
  // Get learner data and deal with potential errors.
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);