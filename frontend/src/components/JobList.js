import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Badge,
  Accordion,
} from "react-bootstrap";
import axios from "axios";

const JobList = () => {
  const API_URL = process.env.REACT_APP_API_URL; // ← Use environment variable here
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    title: "",
    company: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    jobType: "",
    skills: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLoading(true);
      axios
        .get(`${API_URL}/jobs/search/${searchTerm}`)
        .then((response) => {
          setJobs(Array.isArray(response.data) ? response.data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error searching jobs");
          setLoading(false);
          console.error(err);
        });
    } else {
      fetchJobs();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setAdvancedFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdvancedSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams();

    Object.entries(advancedFilters).forEach(([key, value]) => {
      if (value) {
        if (key === "skills" && value) {
          const skillsArray = value.split(",").map((skill) => skill.trim());
          params.append("skills", skillsArray.join(","));
        } else {
          params.append(key, value);
        }
      }
    });

    axios
      .get(`${API_URL}/jobs/search/advanced?${params.toString()}`)
      .then((response) => {
        setJobs(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error performing advanced search");
        setLoading(false);
        console.error(err);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_URL}/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (error) {
        console.error("Error deleting job:", error);
        setError("Failed to delete job. Please try again later.");
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading jobs...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Job Listings</h2>

      <Form onSubmit={handleSearch} className="mb-2">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search jobs by title, skills, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
          {searchTerm && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSearchTerm("");
                fetchJobs();
              }}
            >
              Clear
            </Button>
          )}
        </InputGroup>
        <div className="mt-2">
          <Button
            variant="link"
            className="p-0"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch
              ? "Hide Advanced Search"
              : "Show Advanced Search"}
          </Button>
        </div>
      </Form>

      {showAdvancedSearch && (
        <Accordion className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Advanced Job Search</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleAdvancedSearch}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={advancedFilters.title}
                        onChange={handleFilterChange}
                        placeholder="e.g. Software Engineer"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        name="company"
                        value={advancedFilters.company}
                        onChange={handleFilterChange}
                        placeholder="e.g. Google"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={advancedFilters.location}
                        onChange={handleFilterChange}
                        placeholder="e.g. New York"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Type</Form.Label>
                      <Form.Select
                        name="jobType"
                        value={advancedFilters.jobType}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Salary</Form.Label>
                      <Form.Control
                        type="number"
                        name="minSalary"
                        value={advancedFilters.minSalary}
                        onChange={handleFilterChange}
                        placeholder="e.g. 50000"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maximum Salary</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxSalary"
                        value={advancedFilters.maxSalary}
                        onChange={handleFilterChange}
                        placeholder="e.g. 100000"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Skills (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="skills"
                        value={advancedFilters.skills}
                        onChange={handleFilterChange}
                        placeholder="e.g. JavaScript, React, Node.js"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Experience Level</Form.Label>
                      <Form.Select
                        name="experienceLevel"
                        value={advancedFilters.experienceLevel}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select Experience Level</option>
                        <option value="Entry">Entry Level</option>
                        <option value="Mid">Mid Level</option>
                        <option value="Senior">Senior Level</option>
                        <option value="Executive">Executive Level</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary">
                    Search Jobs
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setAdvancedFilters({
                        title: "",
                        company: "",
                        location: "",
                        minSalary: "",
                        maxSalary: "",
                        jobType: "",
                        skills: "",
                        experienceLevel: "",
                      });
                      fetchJobs();
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      {jobs.length === 0 ? (
        <div className="alert alert-info">No jobs found.</div>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col md={6} lg={4} className="mb-4" key={job._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {job.company}
                  </Card.Subtitle>

                  <div className="mb-2">
                    <Badge bg="primary" className="me-1">
                      {job.jobType}
                    </Badge>
                    {job.location && (
                      <Badge bg="secondary">{job.location}</Badge>
                    )}
                  </div>

                  <Card.Text className="mb-2">
                    {job.description.length > 100 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: job.description.substring(0, 100) + "...",
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    )}
                  </Card.Text>

                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">Skills:</small>
                      <br />
                      {job.skills.map((skill, index) => (
                        <Badge bg="info" className="me-1 mb-1" key={index}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      as={Link}
                      to={`/match/${job._id}`}
                      variant="success"
                      size="sm"
                    >
                      Find Matches
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default JobList;
