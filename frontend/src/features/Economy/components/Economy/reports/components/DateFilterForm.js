import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

/**
 * Date filter form component for reports
 * @param {Object} props - Component props
 * @param {Object} props.dateFilter - Date filter state
 * @param {Function} props.onDateFilterChange - Date filter change handler
 * @param {Function} props.onApplyFilter - Apply filter handler
 * @param {Function} props.onClearFilter - Clear filter handler
 * @returns {JSX.Element} DateFilterForm component
 */
const DateFilterForm = ({ 
  dateFilter, 
  onDateFilterChange, 
  onApplyFilter, 
  onClearFilter 
}) => {
  return (
    <Form className="mb-4">
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => onDateFilterChange({
                ...dateFilter,
                startDate: e.target.value
              })}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => onDateFilterChange({
                ...dateFilter,
                endDate: e.target.value
              })}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button 
            variant="success" 
            className="me-2"
            onClick={onApplyFilter}
          >
            <FaCheck className="me-1" /> Apply Filter
          </Button>
          <Button 
            variant="secondary"
            onClick={onClearFilter}
          >
            <FaTimes className="me-1" /> Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DateFilterForm; 