

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const department_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const department_form_state : any = writable({
    uid : 0,
    name : '',

    used : 1,

  })
  

  export {department_modal_state,department_form_state};