import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  // Search users

  const [state, dispatch] = useReducer(githubReducer, initialState);
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });
    const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      Authorization: `token ${GITHUB_TOKEN}`,
    });
    const { items } = await res.json();
    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  //Get single user
  const getUser = async (login) => {
    setLoading();

    const res = await fetch(`${GITHUB_URL}/users/${login}`, {
      Authorization: `token ${GITHUB_TOKEN}`,
    });
    if (Response.status === 404) {
      window.location = '/notfound';
    } else {
      const data = await res.json();
      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  // Get user repos

  const getUserRepos = async (login) => {
    setLoading();
    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    });

    const res = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      Authorization: `token ${GITHUB_TOKEN}`,
    });
    const data = await res.json();
    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  //Set Loading

  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        getUser,
        getUserRepos,
        dispatch,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
