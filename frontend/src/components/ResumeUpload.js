import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";

const ResumeUpload = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: "Please select a resume file", type: "danger" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("resume", file);

    setLoading(true);

    try {
      await axios.post(`${API_URL}/resumes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ text: "Resume uploaded successfully!", type: "success" });

      setName("");
      setEmail("");
      setPhone("");
      setFile(null);
      document.getElementById("resume-file").value = "";
    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage({
        text: error.response?.data?.message || "Error uploading resume",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Upload Resume</h2>

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
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Resume</Form.Label>
              <Form.Control
                id="resume-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Resume"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResumeUpload;
