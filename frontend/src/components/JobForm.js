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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const API_BASE_URL = process.env.REACT_APP_API_URL; // Already includes /api

    try {
      await axios.post(`${API_BASE_URL}/jobs`, jobData);

      setMessage({ text: "Job posted successfully!", type: "success" });

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
            {[
              {
                label: "Job Title",
                name: "title",
                type: "text",
                required: true,
              },
              {
                label: "Company",
                name: "company",
                type: "text",
                required: true,
              },
              { label: "Location", name: "location", type: "text" },
              {
                label: "Description",
                name: "description",
                type: "textarea",
                rows: 4,
                required: true,
              },
              {
                label: "Requirements (comma-separated)",
                name: "requirements",
                type: "textarea",
                rows: 3,
              },
              {
                label: "Skills (comma-separated)",
                name: "skills",
                type: "text",
              },
              { label: "Experience", name: "experience", type: "text" },
              { label: "Salary", name: "salary", type: "text" },
            ].map((field, idx) => (
              <Form.Group className="mb-3" key={idx}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={field.rows}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required || false}
                  />
                ) : (
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={field.required || false}
                  />
                )}
              </Form.Group>
            ))}

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
