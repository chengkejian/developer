import { useState, useEffect } from 'react';
import { History } from 'history';

export default function useFetch<T>(url: string, history:History) {
  const [data, setData] = useState<T>();

  useEffect(() => {
    async function getData() {
      const response = await fetch(url);
      if (response.status === 401) {
        history.push('/login');
      } else {
        const resp = await response.json();
        console.log(resp);
        setData(resp.data);
      }
    }
    getData();
  }, [url, history]);
  return data;
}
