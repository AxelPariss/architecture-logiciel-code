import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';


let uri = 'http://localhost:1337/graphql'
if (process.env.NODE_ENV === 'production') {
  uri = 'https://architecture-logiciel-code.herokuapp.com/graphql'
}



const client = new ApolloClient({
  uri: uri,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
  <ApolloProvider client={client}>
  <App />
  </ApolloProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
