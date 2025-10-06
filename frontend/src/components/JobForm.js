import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    skills: "",
    experience: "",
    salary: "",
    jobType: "Full-time",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated strings to arrays
    const jobData = {
      ...formData,
      requirements: formData.requirements
        ? formData.requirements.split(",").map((item) => item.trim())
        : [],
      skills: formData.skills
        ? formData.skills.split(",").map((item) => item.trim())
        : [],
    };

    setLoading(true);

    const API_BASE_URL =
      process.env.REACT_APP_API_URL || "http://localhost:5000";

    try {
      const response = await axios.post(`${API_BASE_URL}/api/jobs`, jobData);

      setMessage({
        text: "Job posted successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        skills: "",
        experience: "",
        salary: "",
        jobType: "Full-time",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage({
        text: error.response?.data?.message || "Error posting job",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Post a Job</h2>

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage({ text: "", type: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter job location"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter job description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements (comma-separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter job requirements (separated by commas)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter required skills (separated by commas)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter required experience (e.g., 2+ years)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary range"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Job Type</Form.Label>
              <Form.Select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default JobForm;
