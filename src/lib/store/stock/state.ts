

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const stock_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const stock_form_state : any = writable({
    uid : 0,
    lot : "",
    item : '',
    company : '',
    factory : '',
    factory_sub : '',
    user : '',
    qty : 0,
    unit : "",
    status : "",
    used : 1,
  })


 
  

  export {stock_modal_state,stock_form_state};