import React, { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes');
      setResumes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      fetchResumes();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/resumes/search/${searchTerm}`);
      setResumes(response.data);
    } catch (error) {
      console.error('Error searching resumes:', error);
      setError('Failed to search resumes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading resumes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Resume Database</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search resumes by name, skills, or experience"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="primary">Search</Button>
          {searchTerm && (
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setSearchTerm('');
                fetchResumes();
              }}
            >
              Clear
            </Button>
          )}
        </InputGroup>
      </Form>
      
      {resumes.length === 0 ? (
        <div className="alert alert-info">No resumes found.</div>
      ) : (
        <Row>
          {resumes.map(resume => (
            <Col md={6} lg={4} className="mb-4" key={resume._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{resume.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{resume.email}</Card.Subtitle>
                  
                  {resume.phone && (
                    <Card.Text className="mb-2">
                      <small>Phone: {resume.phone}</small>
                    </Card.Text>
                  )}
                  
                  {resume.skills && resume.skills.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Skills:</small><br />
                      {resume.skills.map((skill, index) => (
                        <Badge bg="info" className="me-1 mb-1" key={index}>{skill}</Badge>
                      ))}
                    </div>
                  )}
                  
                  {resume.experience && resume.experience.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Experience:</small>
                      {resume.experience.map((exp, index) => (
                        <div key={index} className="mb-1">
                          <div><strong>{exp.title}</strong> at {exp.company}</div>
                          <div><small>{exp.duration}</small></div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {resume.education && resume.education.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Education:</small>
                      {resume.education.map((edu, index) => (
                        <div key={index} className="mb-1">
                          <div>{edu.degree}</div>
                          <div><small>{edu.institution}, {edu.year}</small></div>
                        </div>
                      ))}
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

export default ResumeList;