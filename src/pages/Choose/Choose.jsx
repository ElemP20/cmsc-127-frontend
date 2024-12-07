import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  CardActionArea
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Navbar from '../../components/Navbar/Navbar';

const Choose = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'student') {
      navigate('/asdfasdfsd#');
    }
    else if (role == 'admin') {
      navigate('/SysAdmin');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Card sx={{ 
          p: 4, 
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Select Your Role
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 4,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 5
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleRoleSelect('student')}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      Student
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Access your student portal
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 5
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleRoleSelect('professor')}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      Professor
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Access your professor portal
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 5
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleRoleSelect('admin')}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SupervisorAccountIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" component="div" gutterBottom>
                      System Administrator
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Access the System
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Choose;