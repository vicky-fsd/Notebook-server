const redis = require('redis');
const client = redis.createClient();

client.on('error', function (err) {
  console.error('Redis Connection Error:', err);
});

client.on('connect', function () {
  console.log('Connected to Redis');

  // Perform Redis operations (e.g., set and get)
  client.set('exampleKey', 'exampleValue', function (err, reply) {
    if (err) {
      console.error('SET Operation Error:', err);
    } else {
      console.log('SET Operation:', reply);

      // Retrieve the value for the key
      client.get('exampleKey', function (err, value) {
        if (err) {
          console.error('GET Operation Error:', err);
        } else {
          console.log('GET Operation:', value);
        }

        // Quit the Redis connection when done
        client.quit();
      });
    }
  });
});

client.on('ready', function () {
  console.log('Redis client is ready');
});

client.on('end', function () {
  console.log('Connection to Redis has been closed');
});

client.on('error', function (err) {
  console.error('Redis Error:', err);
});
