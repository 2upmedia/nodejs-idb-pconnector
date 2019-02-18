const { DBPool } = require('../lib/idb-pconnector');

const pool = new DBPool({ url: '*LOCAL' });

async function poolExample() {
  // attach() returns an available connection from the pool.
  const connection = pool.attach();
  const statement = connection.getStatement();
  await statement.prepare('CALL QSYS2.TCPIP_INFO()');
  await statement.execute();
  const results = await statement.fetchAll();

  if (results) {
    console.log(`results:\n ${JSON.stringify(results)}`);
  }
  // closes statements makes the Connection available for reuse.
  await pool.detach(connection);
}

poolExample().catch((error) => {
  console.error(error);
});

// Aggregates runSql & prepareExecute

async function prepareExecuteExample() {
  /*
   * Prepare and execute an SQL statement.
   * Params are passed as an array values.
   * The order of the params indexed in the array should map to the order of the parameter markers
   */

  const sql = 'INSERT INTO QIWS.QCUSTCDT VALUES (?,?,?,?,?,?,?,?,?,?,?) with NONE';

  const params = [4949, 'Johnson', 'T J', '452 Broadway', 'MSP', 'MN', 9810, 2000, 1, 250, 0.00];

  await pool.prepareExecute(sql, params);
}

prepareExecuteExample().catch((error) => {
  console.error(error);
});

async function runSqlExample() {
  /*
  * Directly execute a statement by providing the SQL to the runSql() function.
  * NOTE: Stored Procedures must use the prepareExecute() method instead.
  */

  const results = await pool.runSql('SELECT * FROM QIWS.QCUSTCDT');

  if (results) {
    console.log(`results:\n ${JSON.stringify(results)}`);
  }
}

runSqlExample().catch((error) => {
  console.error(error);
});
