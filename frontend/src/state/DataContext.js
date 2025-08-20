import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async ({ page = 1, limit = 5, q = "" } = {}) => {
    // Search url paramas added for searching method
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      q,
    });
    const res = await fetch(`http://localhost:3001/api/items?${params}`); // Intentional bug: backend ignores limit
    const json = await res.json();

    // backend now returns {totalm, page, limit, data}
    setItems(json.data);
    setTotal(json.total);
    return json;
  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);