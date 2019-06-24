import React, { useEffect, useState, Component } from 'react';
import './App.css';
import axios from 'axios';
import useDataApi from 'use-data-api';

class User1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.userId,
      userName: null,
      isLoading: false,
      error: null,
      unmounted: false,
    };
  }

  getUser() {
    this.setState({ isLoading: true, error: null });
  
    axios.get(`https://jsonplaceholder.typicode.com/users/${this.state.userId}`)
      .then(result => {
        if (this.state.unmounted) {
          return;
        }
        this.setState({
          userName: result.data.name,
          isLoading: false
        })
      }
      )
      .catch(error => {
        if (this.state.unmounted) {
          return;
        }

        this.setState({
          error,
          isLoading: false
        })
      });
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate() {
    // this.getUser();
  }

  componentWillUnmount() {
    this.setState({ unmounted: true });
  }

  render() {
    return (<>
      {this.state.isLoading ? <p>Loading ...</p> : <></>}
      {this.state.error ? <p>Cannot load user</p> : <></>}
      {!this.state.isLoading && !this.state.error ? <p>{this.state.userName}</p> : <></>}
      <button onClick={() => {
        const newUserId = this.state.userId + 1;
        this.setState({ userId: newUserId }, this.getUser);
        this.getUser();
      }} >Next</button>
    </>);
  }
}

function User2(props) {
  const [userId, setUserId] = useState(props.userId);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      let response;
      try { 
        response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
      } catch (e) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      if (cancelled) return;
      setName(response.data.name);
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (<>
    {isLoading ? <p>Loading ...</p> : <></>}
    {isError ? <p>Cannot load user</p> : <></>}
    {!isLoading && !isError && name ? <p>{name}</p> : <></>}
    <button onClick={() => setUserId(userId + 1)} >Next</button>
  </>);
}

function User3(props) {
  const [userId, setUserId] = useState(props.userId);
  // https://github.com/the-road-to-learn-react/use-data-api/blob/master/src/index.js
  const [{ data, isLoading, isError }, performFetch] = useDataApi(null, null);

  useEffect(() => {
    performFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  }, [userId, performFetch]);

  return (<>
    {isLoading ? <p>Loading ...</p> : <></>}
    {isError ? <p>Cannot load user</p> : <></>}
    {!isLoading && !isError && data ? <p>{data.name}</p> : <></>}
    <button onClick={() => setUserId(userId + 1)} >Next</button>
  </>);
}

function App() {
  return (
    <User1 userId={1} />
  );
}

export default App;
