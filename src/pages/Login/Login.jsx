import React from 'react'
import LoginCard from '../../components/Cards/LoginCard'
import Navbar from '../../components/Navbar/Navbar'
import { Container } from '@mui/material'

const Login = () => {
  return (
    <>
    <Navbar />
    <Container maxWidth="xl">
      <LoginCard />
    </Container>
    </>
  )
}

export default Login