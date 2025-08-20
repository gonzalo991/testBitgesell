import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from "react-window";

function Items() {
  const { items, total, fetchItems } = useData(); // added total to be used for pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // increase limit to benefit virtualization
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

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div
        style={{ ...style, padding: "0.5rem", borderBottom: `1px solid #eee` }}
      >
        <Link to={'/items/' + item.id}>{item.name}</Link>
      </div>
    );
  };

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

      {/* Virtualized List */}
      <List
        height={400}       // visible height of list
        itemCount={items.length} // number of items
        itemSize={50}      // height of each row
        width={'100%'}     // width of list container
      >
        {Row}
      </List>

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