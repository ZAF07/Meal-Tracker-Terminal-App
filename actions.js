import prompt from 'prompt';
import {
  handleDbInsert,
  handleDbReport,
  handleDbEdit,
  handleDelete,
} from './db.js';

/*

  CALLBACK FUNCTIONS
  Used by the Action Functions to handle data received from DB Queries

*/

// Add Callback
const handleCallbackInsert = (err, result) => {
  if (err) {
    console.log(`Error INSERTING ${err}`);
    process.exit();
  }
  const data = JSON.stringify(result.rows);
  console.log(`SUCCESS INSERTING ${data}`);
  result.rows.forEach((item) => {
    console.log(`
    ***********************************************************
    HERE IS YOUR NEW ENTRY:
    ___________________________________________________________
    id: ${item.id}
    Type: ${item.type}
    Meal: ${item.description}
    Amt. of alcohol: ${item.amount_of_alcohol}
    Hungry before meal?: ${item.was_hungry_before_eating}
    ***********************************************************
    `);
  });
  process.exit();
};

// Select Callback
const handleCallbackReport = (err, result) => {
  if (err) {
    console.log(`ERROR SELECTING ${err}`);
    return;
  }
  console.log(`HERE -->> ${JSON.stringify(result)}`);
  result.rows.forEach((item) => {
    console.log(`
    ***********************************************************
    HERE ARE ALL YOUR ENTRIES:
    ___________________________________________________________
    id: ${item.id}
    Type: ${item.type}
    Meal: ${item.description}
    Amt. of alcohol: ${item.amount_of_alcohol}
    Hungry before meal?: ${item.was_hungry_before_eating}
    ***********************************************************
    `);
  });

  process.exit();
};

// Select by filter
const handleCallbackFilterReport = (err, results) => {
  if (err) {
    console.log(`ERROR FILTER SELECTING action.js ${err}`);
    return;
  }

  console.log(
    `SUCCESSFULL FILTER SELECTING action.js ${JSON.stringify(results)}`
  );
  console.log(`
      ************************************************************
      HERE ARE THE FILTERED RESULTS: 
      There are a total of ${results.rowCount} Item/s 👆
      ____________________________________________________________
    `);
  results.rows.forEach((result) => {
    console.log(`

     
      ID: ${result.id}
      TYPE: ${result.type}
      DESCRIPTION: ${result.description}
      AMOUNT_OF_ALCOHOL: ${result.amount_of_alcohol}
      WAS_HUNGRY_BEFORE_EATING: ${result.was_hungry_before_eating}
      ____________________________________________________________
    `);
  });
  console.log(`
      ************************************************************
      There are a total of ${results.rowCount} Item/s
      END
      ____________________________________________________________
    `);
  process.exit();
};

// Edit Callback
const handleCallbackEdit = (err, result) => {
  if (err) {
    console.log(`ERROR EDITING CALLBACK ${err}`);
    return;
  }

  console.log(`SUCCESS EDIT CALLBACK ${JSON.stringify(result.rows)}`);
  const editedRows = result.rows;

  result.rows.forEach((item) => {
    console.log(`

  ***********************************************
  SUCCESSFUL EDIT!
  ***********************************************
  Here is your updated entry:
  ___________________________
  id: ${item.id}
  type: ${item.type}
  description: ${item.description}
  Amt. of alcohol: ${item.amount_of_alcohol}
  hungry before meal: ${item.was_hungry_before_eating}
  ***********************************************
    `);
  });

  process.exit();
};

// Delete Callback
const handleCallbackDelete = (err, result) => {
  if (err) {
    console.log(` DELETE ERROR FROM action.js ${err}`);
    return;
  }

  console.log(`DELETE SUCCESS FROM action.js ${result}`);
  result.rows.forEach((row) => {
    console.log(`

  ***********************************************
  THIS ITEM HAS BEEN DELETED !
  ***********************************************
  You have removed this from your entry:
  ___________________________
  id: ${row.id}
  type: ${row.type}
  description: ${row.description}
  Amt. of alcohol: ${row.amount_of_alcohol}
  hungry before meal: ${row.was_hungry_before_eating}
  ***********************************************
    `);
  });
  process.exit();
};
/*

  PROMPT SCHEMA
  This is where i define the schema for sending user inputs 
  to collect information to be used or saved in the DB queries

*/

// Add Schema
const addActionSchema = {
  properties: {
    time_of_day: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
    description: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
    amount_of_alcohol: {
      pattern: /^[0-99]*$/,
      message: 'Name must be only numbers',
      required: true,
    },
    was_hungry_before_eating: {
      pattern: /^(?:tru|fals)e$/,
      message: 'Name must be either true or false',
      required: true,
    },
  },
};

// Edit-one Schema
const editOneActionSchema = {
  properties: {
    id: {
      pattern: /^[0-99]*$/,
      message:
        'Id must only contain numbers matching to the Id of entries in DB',
      required: true,
    },
    column_name: {
      pattern: /^[a-zA-Z\s\-_]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
    column_value: {
      pattern: /^[a-zA-Z0-99\s\-_]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
  },
};

// Edit All Schema
const editAllActionSchema = {
  properties: {
    id: {
      pattern: /^[0-99]*$/,
      message:
        'Id must only contain numbers matching to the Id of entries in DB',
      required: true,
    },
    time_of_day: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
    description: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true,
    },
    amount_of_alcohol: {
      pattern: /^[0-99]*$/,
      message: 'Name must be only numbers',
      required: true,
    },
    was_hungry_before_eating: {
      pattern: /^(?:tru|fals)e$/,
      message: 'Name must be either true or false',
      required: true,
    },
  },
};

// Delete Schema
const deleteActionSchema = {
  properties: {
    id: {
      pattern: /^[0-99]*$/,
      message:
        'Id must only contain numbers matching to the Id of entries in DB',
      required: true,
    },
  },
};

/*

  ACTION Functions
  AKA Controllers in the MVC pattern
  This are functions that execute the logic of the program
  exported to index for usage depending on the process.argv value

*/

// Add Action
export const handleActionAdd = () => {
  // Start the prompt
  prompt.start();
  //
  // Get two properties from the user: email, password
  //
  prompt.get(addActionSchema, function (err, result) {
    //
    // Retrieve the user input  and run the DB helprt function to persist information on DB
    //

    if (err) {
      return handleError(err);
    }

    console.log('Command-line input received:');
    console.log(`  Type:  ${result.time_of_day}`);
    console.log(`  description:  + ${result.description}`);
    console.log(` amount_of_alcohol: ${result.amount_of_alcohol}`);
    console.log(` amount_of_alcohol: ${result.was_hungry_before_eating}`);

    // Values to be saved to DB
    const valuesToSave = [
      `${result.time_of_day}`,
      `${result.description}`,
      `${result.amount_of_alcohol}`,
      `${result.was_hungry_before_eating}`,
    ];
    // DB Query
    const insertQuery =
      'INSERT INTO meal (type, description, amount_of_alcohol, was_hungry_before_eating) VALUES ($1, $2, $3, $4) RETURNING *';

    // Add to DB
    handleDbInsert(insertQuery, valuesToSave, handleCallbackInsert);
  });
  // Error hanlder for prompt.get()
  const handleError = (err) => {
    console.log(`ERROPR ${err}`);
    return prompt.stop();
  };
};

// Read Action
export const handleActionReport = async () => {
  // Filter search by this variable given by user
  let filterQuery;

  // Start prompt
  prompt.start();

  const { filter_by } = await prompt.get('filter_by');

  // Perform query based on user input via prompt
  switch (filter_by) {
    case 'id':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = ` SELECT * FROM meal WHERE ${filter_by} = 0 OR ${filter_by} > 0 ORDER BY ${filter_by} DESC`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'breakfast':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = `SELECT * FROM meal WHERE type = '${filter_by}'`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'lunch':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = `SELECT * FROM meal WHERE type = '${filter_by}'`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'dinner':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = `SELECT * FROM meal WHERE type = '${filter_by}'`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'supper':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = `SELECT * FROM meal WHERE type = '${filter_by}'`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'description':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = ` SELECT ${filter_by} FROM meal`;
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'alcohol':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery = 'SELECT * FROM meal WHERE amount_of_alcohol > 0';
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'was_hungry':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery =
        "SELECT * FROM meal WHERE was_hungry_before_eating = 'true'";
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;
    case 'not_hungry':
      console.log(`${filter_by} WAS ASKED FOR`);
      filterQuery =
        "SELECT * FROM meal WHERE was_hungry_before_eating = 'false'";
      handleDbReport(filterQuery, handleCallbackFilterReport);
      break;

    default:
      console.log(`
      #####################################################################
      COULDN'T FIND YOUR FILTER ! BE SURE TO FILTER BY KEYS IN YOUR ENTRIES
      #####################################################################
      
      HERE ARE ALL YOUR ENTRIES
      `);
      filterQuery = 'SELECT * FROM meal';
      handleDbReport(filterQuery, handleCallbackReport);
      break;
  }
};

// Edit Action

// EDIT ONE
export const handleActionEditOne = (id) => {
  // Prompt user to make edits and collect inputs
  // Start the prompt
  prompt.start();
  //
  // Get two properties from the user: email, password
  //
  prompt.get(editOneActionSchema, function (err, result) {
    //
    // Retrieve the user input  and run the DB helprt function to persist information on DB
    //

    if (err) {
      return handleError(err);
    }

    console.log('Command-line input received:');
    console.log(`  Column_name:  ${result.column_name}`);
    console.log(`  Column_value: ${result.column_value}`);

    // DB Query
    const editQuery = `UPDATE meal SET ${result.column_name} = '${result.column_value}' WHERE id = ${result.id} RETURNING *`;

    // Edit changes to DB
    handleDbEdit(editQuery, handleCallbackEdit);
  });
  // Error hanlder for prompt.get()
  const handleError = (err) => {
    console.log(`ERROPR ${err}`);
    return prompt.stop();
  };
};
// EDIT ALL
export const handleActionEditAll = (id) => {
  // Start the prompt
  prompt.start();
  //
  // Get two properties from the user: email, password
  //
  prompt.get(editAllActionSchema, function (err, result) {
    //
    // Retrieve the user input  and run the DB helprt function to persist information on DB
    //

    if (err) {
      return handleError(err);
    }

    console.log('Command-line input received:');
    console.log(`  Type:  ${result.time_of_day}`);
    console.log(`  description:  + ${result.description}`);
    console.log(` amount_of_alcohol: ${result.amount_of_alcohol}`);
    console.log(` amount_of_alcohol: ${result.was_hungry_before_eating}`);

    // Values to be saved to DB
    const valuesToEdit = [
      `${result.time_of_day}`,
      `${result.description}`,
      `${result.amount_of_alcohol}`,
      `${result.was_hungry_before_eating}`,
      `${result.id}`,
    ];
    // DB Query
    const editQuery = `UPDATE meal  SET type = '${valuesToEdit[0]}', description = '${valuesToEdit[1]}', amount_of_alcohol = '${valuesToEdit[2]}', was_hungry_before_eating = '${valuesToEdit[3]}' WHERE id = ${valuesToEdit[4]} RETURNING * `;

    // Add to DB
    handleDbEdit(editQuery, handleCallbackEdit);
  });
  // Error hanlder for prompt.get()
  const handleError = (err) => {
    console.log(`ERROPR ${err}`);
    return prompt.stop();
  };
};

export const handleActionDelete = (id) => {
  // Start the prompt
  prompt.start();
  //
  // Get two properties from the user: email, password
  //
  prompt.get(deleteActionSchema, function (err, result) {
    //
    // Retrieve the user input  and run the DB helprt function to persist information on DB
    //

    if (err) {
      return handleError(err);
    }

    console.log('Command-line input received:');
    console.log(`  ID:  ${result.id}`);

    // DB query
    const deleteQuery = `DELETE FROM meal WHERE id = ${result.id} RETURNING *`;

    // Add to DB
    handleDelete(deleteQuery, handleCallbackDelete);
  });
  // Error hanlder for prompt.get()
  const handleError = (err) => {
    console.log(`ERROPR ${err}`);
    return prompt.stop();
  };
};
