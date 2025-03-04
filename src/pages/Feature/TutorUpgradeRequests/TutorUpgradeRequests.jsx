import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import requests from '../../../Utils/requests'; // Adjust the import path as necessary

export default function TutorUpgradeRequests() {
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpgradeRequests = async () => {
      try {
        const response = await requests.get('/UpgradeRequest/pending');
        setUpgradeRequests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpgradeRequests();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error fetching upgrade requests: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tutor Upgrade Requests
      </Typography>
      <List>
        {Array.isArray(upgradeRequests) && upgradeRequests.map((request) => (
          <ListItem key={request.id}>
            <ListItemText
              primary={`Tutor: ${request.tutorName}`}
              secondary={`Requested on: ${new Date(request.requestDate).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 