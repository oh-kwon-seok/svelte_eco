

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const item_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const item_form_state : any = writable({
    uid : 0,
    
    name : '',
    type : '기타',
    company : '',
    used : 1,

  })
  

  export {item_modal_state,item_form_state};