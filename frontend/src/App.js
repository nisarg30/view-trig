import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ NIFTY_1: [], NIFTY_5: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://view-trig.onrender.com/data'); // Replace with your backend URL
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const renderItem = (item) => (
    <div style={styles.row} key={item.time}>
      <div style={styles.cell}>{item.time}</div>
      <div style={styles.cell}>{item.direction}</div>
      <div style={styles.cell}>{item.result.toString()}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>NIFTY_1</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.NIFTY_1.map(renderItem)}
        </div>
      )}
      <h1>NIFTY_5</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.NIFTY_5.map(renderItem)}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  cell: {
    fontSize: '16px',
  },
};

export default App;
