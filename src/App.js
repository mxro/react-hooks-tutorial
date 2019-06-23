import React, {useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function User(props) {
  const [userId, setUserId] = useState(props.userId);
  const [name, setName] = useState(null);

  useEffect(() => {
    let unmounted = false;
    const fetchData = async () => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (unmounted) return;
      setName(response.data.name);
    };
    fetchData();
    return () => {
      unmounted = true;
    };
  }, [userId]);

  return (<><p>{name}</p><button onClick={() => setUserId(userId+1)} >Next</button></>);
}

function App() {
  return (
    <User userId={1}/>
  );
}

export default App;
