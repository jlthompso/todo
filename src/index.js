import {initFirebase} from './database';
import {taskFactory} from './task';
import {initDOM} from './dom';
import {initForm} from './form';

let database = initFirebase();
initDOM();
initForm();