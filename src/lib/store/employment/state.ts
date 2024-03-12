

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const employment_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const employment_form_state : any = writable({
    uid : 0,
    name : '',
    name2 : '',
    company : '',
    used : 1,

  })
  

  export {employment_modal_state,employment_form_state};