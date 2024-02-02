

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const position_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const position_form_state : any = writable({
    uid : 0,
    name : '',
    name2 : '',
    used : 1,

  })
  

  export {position_modal_state,position_form_state};