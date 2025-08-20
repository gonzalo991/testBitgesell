import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, total, fetchItems } = useData(); // added total to be used for pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    // Intentional bug: setState called after component unmount if request is slow
    // fetchItems().then(()=>{
    //   if(!active) return;
    // })
    // .catch(console.error);

    const loadItems = async () => {
      try {
        const data = await fetchItems({ page, limit, q: search }); // fetch items now recieved params for pagination
        if (!active) return;
      } catch (error) {
        console.error(error);
      }
    }

    loadItems();

    // Clean‑up to avoid memory leak (candidate should implement)
    return () => {
      active = false;
    };
  }, [fetchItems, page, limit, search]);

  if (!items.length) return <p>Loading...</p>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2>Items</h2>
      <input
        type='text'
        placeholder='Search items...'
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        style={{ marginBottom: "1rem" }}
      />

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⬅️ Previous
        </button>

        <span style={{ margin: "0 1rem" }}>Page {page} of {totalPages} </span>

        <button onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default Items;