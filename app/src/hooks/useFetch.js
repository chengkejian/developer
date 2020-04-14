import { useState, useEffect } from 'react';

export default function useFetch(url, history) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch(url);
      if (response.status === 401) {
        history.push('/login');
      } else {
        const data = await response.json();
        console.log(data);
        setData(data.data);
      }
    }
    getData();
  }, [url, history]);
  return data;
}
