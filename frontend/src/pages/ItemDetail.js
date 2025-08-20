import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

function ItemDetail() {
  const { id } = useParams();
  const { items } = useData();
  const navigate = useNavigate();

  const item = items.find(i => String(i.id) === id);

  if (!item) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundImage: "url(https://wallpapers.com/images/hd/4k-tech-1eweq7h47kehxd7y.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        padding: "2rem"
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} style={{display:"flex",justifyContent:"center"}}>
            <Card className="shadow-lg text-white"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #183e6b, #0c1a2d)',
                width: "50%",
              }}
            >
              <Card.Body className="text-center p-5">
                <h2 className="fw-bold mb-4" style={{ color: '#89f7fe', textAlign:"center", margin:"0.8rem" }}>{item.name}</h2>

                <div className="fs-8 mb-3"
                style={{textAlign:"center", margin:"1rem"}}>
                  <strong>Category:</strong> {item.category}
                </div>

                <div className="fs-6 mb-4" style={{textAlign:"center", margin:"1rem", color:"#fff"}}>
                  <strong>Price:</strong> ${item.price}
                </div>

                <div className="d-flex justify-content-center">
                  <div className="badge"
                    style={{
                      background: 'linear-gradient(90deg, #66a6ff, #0a56b6)',
                      fontSize: '1rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      textAlign:"center"
                    }}
                  >
                    {item.category}
                  </div>
                </div>

                <Button
                  className=" px-4 py-2 fw-bold"
                  variant="light"
                  onClick={() => navigate(-1)}
                  style={{marginTop:"1rem"}}
                >
                   Back to Items
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ItemDetail;