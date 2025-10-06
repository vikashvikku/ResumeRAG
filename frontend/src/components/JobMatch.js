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

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "[http://localhost:5000/api](http://localhost:5000/api)";

  useEffect(() => {
    const fetchJobAndMatches = async () => {
      try {
        const jobResponse = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
        setJob(jobResponse.data);

        const matchesResponse = await axios.get(
          `${API_BASE_URL}/resumes/match/${jobId}`
        );
        let data = matchesResponse.data;

        // ✅ Ensure matches is always an array
        if (Array.isArray(data)) {
          setMatches(data);
        } else if (data?.matches && Array.isArray(data.matches)) {
          setMatches(data.matches);
        } else {
          console.warn("Unexpected matches data format:", data);
          setMatches([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job matches:", error);
        setError("Failed to load job matches. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobAndMatches();
  }, [jobId, API_BASE_URL]);

  if (loading)
    return <div className="text-center my-5">Loading job matches...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!job) return <Alert variant="warning">Job not found.</Alert>;

  return (
    <div>
      {" "}
      <h2 className="mb-4">Resume Matches for Job</h2>
      ```
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{job.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {job.company}
          </Card.Subtitle>

          <div className="mb-2">
            <Badge bg="primary" className="me-1">
              {job.jobType}
            </Badge>
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
                  <Badge bg="info" className="me-1 mb-1" key={index}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
      <h3 className="mb-3">Matching Candidates</h3>
      {matches.length === 0 ? (
        <Alert variant="info">No matching candidates found for this job.</Alert>
      ) : (
        <Row>
          {matches.map(({ resume, matchPercentage }, index) => (
            <Col md={6} className="mb-4" key={resume?._id || index}>
              <Card className="h-100">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Match Score</span>
                    <span className="fw-bold">{matchPercentage || 0}%</span>
                  </div>
                  <ProgressBar
                    now={matchPercentage || 0}
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
                  <Card.Title>{resume?.name || "Unknown Candidate"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {resume?.email || "No email provided"}
                  </Card.Subtitle>

                  {resume?.skills?.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Skills:</small>
                      <br />
                      {resume.skills.map((skill, i) => {
                        const isMatch = job.skills?.some(
                          (jobSkill) =>
                            jobSkill.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <Badge
                            bg={isMatch ? "success" : "info"}
                            className="me-1 mb-1"
                            key={i}
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
