import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

const pools = [];
app.use(bodyParser.json());
// First POST endpoint
app.post('/values', (req, res) => {
  // Iterates through the array of pools to find whether there already is
  // pool with the same poolId
  const pool = pools.find((item) => {
    return item.poolId === req.body.poolId;
  });

  // If there is not a pool with poolId in request object,
  // we push a new pool into the pools array and send "Inserted" response

  // Else, if there already is pool with such poolId,
  // we append the array of poolValues with new values and send "Appended" response
  if (!pool) {
    // Simply push new item to array
    pools.push(req.body);
    res.send('Inserted');
  } else {
    // Here we loop over the elements in poolValues array in request object and append it into pool.poolValues
    for (let i = 0; i < req.body.poolValues.length; i++) {
      pool.poolValues = [...pool.poolValues, req.body.poolValues[i]];
    }
    // Then we search for the index of the pool with corresponding poolId and update it
    const index = pools.findIndex((el) => el.poolId === req.body.poolId);
    pools[index] = pool;
    res.send('Appended');
  }
});

// Second POST endpoint
app.post('/percentiles', (req, res) => {
  // Create var to count total number of elements in all pools
  var totalElements = 0;
  for (let i = 0; i < pools.length; i++) {
    totalElements += pools[i].poolValues.length;
  }
  // Iterates through the array of pools to find whether there already is
  // pool with the same poolId
  const pool = pools.find((item) => {
    return item.poolId === req.body.poolId;
  });
  //Calculate the percentile of values the requested pool object has over total number of values
  const percentile = ((pool.poolValues.length * 100) / totalElements).toFixed(
    2
  );
  res.send({ poolId: req.body.poolId, percentile: percentile });
});

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
