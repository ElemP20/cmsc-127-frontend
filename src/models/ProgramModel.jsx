import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('https://one27-advising.onrender.com/apis/getAllPrograms');
      setPrograms(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error('Error fetching programs:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const refreshPrograms = () => {
    setLoading(true);
    fetchPrograms();
  };

  return (
    <ProgramContext.Provider value={{ 
      programs, 
      loading, 
      error, 
      refreshPrograms 
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const usePrograms = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('usePrograms must be used within a ProgramProvider');
  }
  return context;
};