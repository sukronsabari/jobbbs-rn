import { useEffect, useState } from 'react';
import axios from 'axios';
// import { RAPID_API_KEY } from '@env';

// const rapidApiKey = RAPID_API_KEY;

export default function useFetch({ endpoint, params }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(false);

  const options = {
    method: 'GET',
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    headers: {
      'X-RapidAPI-Key': '085cd72452mshbb4376256a41e45p1bbde3jsnb181388c6154',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
    params: { ...params },
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.request(options);
      setData(response.data.data);
    } catch (error) {
      setError(true);
      alert('Threre is an error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
}
