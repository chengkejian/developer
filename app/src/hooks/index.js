import { useState, useEffect } from 'react';

export default function useFetch(url, history, notReal) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      if (!notReal) {
        const response = await fetch(url);
        if (response.status === 401) {
          history.push('/login');
        } else {
          const data = await response.json();
          console.log(data);
          setData(data);
        }
      } else {
        setData({});
      }
    }
    getData();
  }, [url, history, notReal]);
  return data;
}
