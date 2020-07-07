const mysql = require('mysql');
const debug = require('debug')('app:db');

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3307,
  database: 'aeecmedicare',
};

function handleDisconnect() {
  const dbConnection = mysql.createConnection(config);
  dbConnection.connect((err) => {
    if (err) {
      console.log('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 8000);
    } else {
      console.log('Connection established with MySQL DB');
      dbConnection.query('select * from user', function(error, rows, fields){
        if(!!error){
          console.log('Error in query')
        }
        else{
          console.log(rows)
        }
      });
    }
  });
  dbConnection.on('error', (err) => {
    console.log('Error occurred in MySQL DB connection', err);
    handleDisconnect();
  });

  return dbConnection;
}

const dbConnection = handleDisconnect();

module.exports = dbConnection;