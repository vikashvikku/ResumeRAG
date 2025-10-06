import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, ProgressBar, Row, Col, Badge, Alert } from "react-bootstrap";
import axios from "axios";

const JobMatch = () => {
const { jobId } = useParams();
const [job, setJob] = useState(null);
const [matches, setMatches] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// ✅ Use API base from .env (includes /api)
const API_BASE_URL = process.env.REACT_APP_API_URL || "[http://localhost:5000/api](http://localhost:5000/api)";

useEffect(() => {
const fetchJobAndMatches = async () => {
try {
// ✅ Corrected URLs (no extra /api)
const jobResponse = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
setJob(jobResponse.data);


    const matchesResponse = await axios.get(`${API_BASE_URL}/resumes/match/${jobId}`);
    setMatches(matchesResponse.data);

    setLoading(false);
  } catch (error) {
    console.error("Error fetching job matches:", error);
    setError("Failed to load job matches. Please try again later.");
    setLoading(false);
  }
};

fetchJobAndMatches();


}, [jobId, API_BASE_URL]);

if (loading) return <div className="text-center my-5">Loading job matches...</div>;
if (error) return <Alert variant="danger">{error}</Alert>;
if (!job) return <Alert variant="warning">Job not found.</Alert>;

return ( <div> <h2 className="mb-4">Resume Matches for Job</h2>

```
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>{job.title}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>

      <div className="mb-2">
        <Badge bg="primary" className="me-1">{job.jobType}</Badge>
        {job.location && <Badge bg="secondary">{job.location}</Badge>}
      </div>

      <Card.Text>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </Card.Text>

      {job.skills?.length > 0 && (
        <div className="mb-3">
          <strong>Required Skills:</strong>
          <div>
            {job.skills.map((skill, index) => (
              <Badge bg="info" className="me-1 mb-1" key={index}>{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {job.requirements?.length > 0 && (
        <div className="mb-3">
          <strong>Requirements:</strong>
          <ul>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </Card.Body>
  </Card>

  <h3 className="mb-3">Matching Candidates</h3>

  {Array.isArray(matches) && matches.length === 0 ? (
    <Alert variant="info">No matching candidates found for this job.</Alert>
  ) : (
    <Row>
      {Array.isArray(matches) &&
        matches.map(({ resume, matchPercentage }) => (
          <Col md={6} className="mb-4" key={resume._id}>
            <Card className="h-100">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Match Score</span>
                  <span className="fw-bold">{matchPercentage}%</span>
                </div>
                <ProgressBar
                  now={matchPercentage}
                  variant={
                    matchPercentage >= 80
                      ? "success"
                      : matchPercentage >= 50
                      ? "warning"
                      : "danger"
                  }
                  className="mt-2"
                />
              </Card.Header>
              <Card.Body>
                <Card.Title>{resume.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {resume.email}
                </Card.Subtitle>

                {resume.phone && (
                  <Card.Text className="mb-2">
                    <small>Phone: {resume.phone}</small>
                  </Card.Text>
                )}

                {resume.skills?.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted">Skills:</small>
                    <br />
                    {resume.skills.map((skill, index) => {
                      const isMatch = job.skills?.some(
                        (jobSkill) =>
                          jobSkill.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <Badge
                          bg={isMatch ? "success" : "info"}
                          className="me-1 mb-1"
                          key={index}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
  )}
</div>

);
};

export default JobMatch;
