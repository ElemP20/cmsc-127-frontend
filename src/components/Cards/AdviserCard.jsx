import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Stack, Paper } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';

const AdviserCard = ({ userInfo }) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Adviser Profile
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {userInfo?.first_name} {userInfo?.middle_name?.charAt(0)}. {userInfo?.last_name}
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <BadgeIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Adviser ID
              </Typography>
            </Stack>
            <Typography variant="h6">
              {userInfo?.adviser_id}
            </Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <BusinessIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Department
              </Typography>
            </Stack>
            <Typography variant="h6">
              {userInfo?.department}
            </Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <WorkIcon color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Position
              </Typography>
            </Stack>
            <Typography variant="h6">
              {userInfo?.position}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AdviserCard;