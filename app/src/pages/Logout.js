import React from 'react';
import Container from '@material-ui/core/Container';

export default function Logout() {
  // useEffect(() => {
    const url = '/api/logout';

    fetch(url, {
      method: 'GET', // or 'PUT'
    }).then((res) => res.text())
      .catch((error) => {
        console.error('Error:', error);
        alert('Error');
      })
      .then((response) => {
        console.log('Success:', response);
        window.location.replace('/login');
      });
  // });

  return (
    <Container component="main" maxWidth="xs">
      Logout
    </Container>
  );
}
