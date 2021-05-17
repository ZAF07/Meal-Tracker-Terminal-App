import {
  handleActionAdd,
  handleActionReport,
  handleActionEditOne,
  handleActionEditAll,
  handleActionDelete,
} from './actions.js';

const action = process.argv[2];
const a = (a) => {
  console.log(`${a} was called`);
  process.exit();
};

const init = (action) => {
  switch (action) {
    case 'add':
      handleActionAdd();
      break;
    case 'edit-one':
      handleActionEditOne();
      break;
    case 'edit':
      handleActionEditAll();
      break;
    case 'report':
      handleActionReport();
      break;
    case 'delete':
      handleActionDelete();
      break;

    default:
      break;
  }
};
init(action);
