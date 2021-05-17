import pg from 'pg';

const { Client } = pg;
const pgConnectionConfigs = {
  user: 'zaffere',
  host: 'localhost',
  database: 'mealtracker',
  port: 5432,
};

const client = new Client(pgConnectionConfigs);

// client.connect();

// const dbQuery =
//   "INSERT INTO meal (type, description, amount_of_alcohol, was_hungry_before_eating) VALUES ('Chicken Rice', 'Tasty meal from Maxwell Market', 0, true)";

// const dbSelect = 'SELECT * FROM meal';

// client.query(dbSelect, (err, result) => {
//   if (err) {
//     console.log(`ERROR SAVING ${err}`);
//   } else {
//     console.log(`Success ${JSON.stringify(result.rows)}`);
//   }

//   client.end();
// });
client.connect();

export const handleDbInsert = (query, input, callback) => {
  client.query(query, input, (err, result) => {
    if (err) {
      console.log(` INSERT ERROR FROM db.js ${err}`);
      callback(err, null);
      return;
    } else {
      console.log(`'ADD SUCCESS FROM db.js ! ${result}'`);
      callback(null, result);
    }
    client.end();
  });
};

export const handleDbReport = (query, callback) => {
  client.query(query, (err, result) => {
    if (err) {
      console.log(` SELECT ERROR FROM db.js ${err}`);
      callback(err, null);
      return;
    } else {
      console.log(`SELECT SUCCESS FROM db.js ${result}`);
      callback(null, result);
    }
    client.end();
  });
};

export const handleDbEdit = (query, callback) => {
  client.query(query, (err, result) => {
    if (err) {
      console.log(` EDIT ERROR FROM db.js ${err}`);
      callback(err, null);
      return;
    }

    console.log(`UPDATE SUCCESS FROM db.js ${result}`);
    callback(null, result);

    client.end();
  });
};

export const handleDelete = (query, callback) => {
  client.query(query, (err, result) => {
    if (err) {
      console.log(`ERROR FROM db.js ${err}`);
      callback(err, null);
      return;
    }

    console.log(`SUCCESS FROM db.js ${result}`);
    callback(null, result);
  });
};

// DB NAME -> data_base_name
// TABLE NAME -> data_base_names
// COLUMN NAME ->  name
