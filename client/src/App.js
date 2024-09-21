import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { AuthProvider, useAuth } from './auth/authContext';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Partners from './pages/Partners';
import Products from './pages/Products';
import Stocks from './pages/Stock';
import Taxes from './pages/Tax';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<IsAuthenticated><Login /></IsAuthenticated>} />
            <Route path='/dashboard' element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path='/categories' element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            } />

            <Route path='/orders' element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />

            <Route path='/partners' element={
              <PrivateRoute>
                <Partners />
              </PrivateRoute>
            } />

            <Route path='/products' element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            } />

            <Route path='/stocks' element={
              <PrivateRoute>
                <Stocks />
              </PrivateRoute>
            } />

            <Route path='/taxes' element={
              <PrivateRoute>
                <Taxes />
              </PrivateRoute>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();

  if(loading) return null;

  console.log(user);

  return user ? children : <Navigate to='/' />
};

const IsAuthenticated = ({ children }) => {
  const {user, loading, logout } = useAuth();

  if(loading) return null;

  return !user ? children : <Navigate to='/dashboard' />
  
};

export default App;
