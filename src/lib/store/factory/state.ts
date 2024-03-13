

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const factory_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    
    check_delete : { use : false, title: ''},
   
   
  
   });

  const factory_form_state : any = writable({
    uid : 0,
    
    name : '',
    status : '',
    description : '',
    company : '',
    factory_sub_array : [],
    used : 1,
  })
  

  export {factory_modal_state,factory_form_state};