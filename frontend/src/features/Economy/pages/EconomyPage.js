import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { BarChartOutlined, FileTextOutlined, CalendarOutlined, SolutionOutlined } from '@ant-design/icons';
import { EconomyProvider } from '../contexts/EconomyContext';

const { Title } = Typography;

/**
 * Main Economy page component
 * Serves as the entry point for the Economy feature
 */
const EconomyPage = () => {
  return (
    <EconomyProvider>
      <div className="economy-page-container">
        <Title level={2}>Οικονομική Διαχείριση</Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={8}>
            <Card 
              hoverable
              title={<><BarChartOutlined /> Οικονομικές Αναλύσεις</>}
              extra={<Link to="/economy/dashboard"><Button type="primary" size="small">Άνοιγμα</Button></Link>}
              style={{ height: '100%' }}
            >
              <p>Πρόσβαση σε αναλυτικά γραφήματα και στατιστικά στοιχεία για τα οικονομικά της επιχείρησης.</p>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Card 
              hoverable
              title={<><FileTextOutlined /> Οικονομικό Φύλλο</>}
              extra={<Link to="/economy/financials"><Button type="primary" size="small">Άνοιγμα</Button></Link>}
              style={{ height: '100%' }}
            >
              <p>Διαχείριση οικονομικών δεδομένων σε μορφή πίνακα με μηνιαία και ετήσια στοιχεία.</p>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Card 
              hoverable
              title={<><CalendarOutlined /> Ημερήσια Οικονομικά</>}
              extra={<Link to="/economy/daily"><Button type="primary" size="small">Άνοιγμα</Button></Link>}
              style={{ height: '100%' }}
            >
              <p>Καταγραφή και παρακολούθηση ημερήσιων οικονομικών κινήσεων, εσόδων και εξόδων.</p>
            </Card>
          </Col>
          
          <Col xs={24} md={12} lg={8}>
            <Card 
              hoverable
              title={<><SolutionOutlined /> Διαχείριση Εξόδων</>}
              extra={<Link to="/economy/expenses"><Button type="primary" size="small">Άνοιγμα</Button></Link>}
              style={{ height: '100%' }}
            >
              <p>Καταχώρηση και παρακολούθηση λειτουργικών εξόδων, μισθοδοσίας και άλλων δαπανών.</p>
            </Card>
          </Col>
        </Row>
      </div>
    </EconomyProvider>
  );
};

export default EconomyPage; 