

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const stock_inout_modal_state : any = writable( {
    title : '',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
   
    check_delete : { use : false, title: ''},
    print : { use : false, title: ''},
   
   
   });

  const stock_inout_form_state : any = writable({
    uid : 0,
    modal: false,
    user : '',
    company : '',
    doc_type : '출고',
    status : '생산',

  
    stock_inout_sub_array : [],

    
  })
  

  export {stock_inout_modal_state,stock_inout_form_state};