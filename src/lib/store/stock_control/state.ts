

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const stock_record_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const stock_record_form_state : any = writable({
    uid : 0,
    stock_inout : '',
    item : '',
    company : '',
    out_factory : '',
    out_factory_sub : '',
    in_factory : '',
    in_factory_sub : '',
    lot : "",
    qty : 0,
    unit : "",
    status : "",
    reason : "",
    
  })


 
  

  export {stock_record_modal_state,stock_record_form_state};