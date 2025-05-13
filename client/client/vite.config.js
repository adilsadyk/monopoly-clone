export default {
    server: {
      proxy: {
        '/socket.io': 'http://localhost:3000',
      }
    }
  }
  