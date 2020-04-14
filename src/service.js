import {
        writable
} from 'svelte/store';

const REQ_STATUS = writable("");
const RES_STATUS = writable("");
const REQ_MSG = writable("");
const RES_MSG = writable("");
const OBJ = writable("");
const HISTORY = writable("");

export { REQ_STATUS,RES_STATUS, REQ_MSG,RES_MSG, OBJ,HISTORY }
