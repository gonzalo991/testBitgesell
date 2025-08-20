import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from "react-window";
import { Container, Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';

function Items() {
  const { items, total, fetchItems } = useData(); // added total to be used for pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // increase limit to benefit virtualization
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    // Intentional bug: setState called after component unmount if request is slow
    // fetchItems().then(()=>{
    //   if(!active) return;
    // })
    // .catch(console.error);

    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchItems({ page, limit, q: search }); // fetch items now recieved params for pagination
        if (!active) return;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadItems();

    // Clean‑up to avoid memory leak (candidate should implement)
    return () => {
      active = false;
    };
  }, [fetchItems, page, limit, search]);

  const totalPages = Math.ceil(total / limit);

  const RowItem = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5rem"
      }}>
        <Card className="text-center shadow-lg"
          style={{
            width: '100%',
            maxWidth: '500px',
            minWidth: '300px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #183e6b, #0c1a2d)',
            color: '#fff'
          }}>
          <Card.Body>
            <Link to={'/items/' + item.id}
              className="text-decoration-none fw-bold fs-5"
              style={{
                color: '#89f7fe',
                display: "flex",
                justifyContent: "center"
              }}>
              {item.name}
            </Link>
            <div className="fs-6" style={{
              color: '#fff',
              display: "flex",
              justifyContent: "center",
              margin: "0.5rem 0"
            }}>
              ${item.price}
            </div>
            <div className="badge mt-2"
              style={{
                background: 'linear-gradient(90deg, #66a6ff, #0a56b6)',
                color: '#fff',
                fontSize: '0.9rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '10px',
                display: "flex",
                justifyContent: "center"
              }}>
              {item.category}
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center" style={{
      backgroundImage: "url(https://wallpapers.com/images/hd/4k-tech-1eweq7h47kehxd7y.jpg)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      // background: "linear-gradient(135deg,rgb(218, 227, 240),rgb(100, 167, 198))",
      paddingBottom: "3rem",
      paddingTop: "2rem"
    }}>
      {/* Banner */}
      <div style={{ width: "95%", height: "200px", margin: "2rem", borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
        <img
          src="https://cryptoslate.com/wp-content/uploads/2020/06/BITGESELL-social.jpg"
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <Container>
        <Row className="mb-3 text-center" >
          <Col>
            <h2 className="fw-bold display-6"
              style={{ display: "flex", justifyContent: "center", fontSize: "3rem", color: "#fff" }}
            >
              Our Products
            </h2>
          </Col>
        </Row>

        <Row className="mb-4 justify-content-center">
          <Col md={6} style={{ display: "flex", justifyContent: "center" }}>
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => {
                e.preventDefault();
                setPage(1);
                setSearch(e.target.value);
              }}
              className="shadow-sm rounded-pill p-3 fs-5 text-center"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: 'none',
                fontSize: '1.2rem',
                border: "3px solid #eee",
                borderRadius: "10px",
                margin: "1.5rem"
              }}
              onFocus={(e) => e.target.scrollIntoView({ block: "center", behavior: "smooth" })}
            />
          </Col>
        </Row>

        {/* Virtualized List */}
        <Row style={{ minHeight: '500px' }}>
          <Col>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                <Spinner animation="grow" variant="primary" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center fs-5">No items found.</p>
            ) : (
              <List
                height={450}
                itemCount={items.length}
                itemSize={120}
                width={'100%'}
                style={{ overflowX: 'hidden' }} // evita scroll horizontal accidental
              >
                {RowItem}
              </List>
            )}
          </Col>
        </Row>

        {/* Pagination */}
        <Row className="mt-4"
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: "#fff",
            marginTop: "1rem"
          }}>
          <Col xs="auto">
            <div className="d-flex justify-content-center align-items-center gap-6"
              style={{ margin: "0.5rem", padding: "1rem" }}
            >
              <Button
                variant="primary"
                className="px-5 py-3 fw-bold fs-5"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{ margin: "0.5rem", fontSize: "1rem", color: "#000", background: "#e1e1e1", cursor: "pointer" }}
              >
                ⬅️ Prev
              </Button>

              <span className="fs-4 fw-bold text-white">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="primary"
                className="px-5 py-3 fw-bold fs-5"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                style={{ margin: "0.5rem", fontSize: "1rem", color: "#000", background: "#e1e1e1", cursor: "pointer" }}
              >
                Next ➡️
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Items;