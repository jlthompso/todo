// Make sure modules are imported so they're configured correctly
import {configureDatabase} from './database';
import {loadPage} from './dom';

let uid = "jthompso";

configureDatabase(uid);
loadPage();