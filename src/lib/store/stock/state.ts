

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const stock_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    stock_inout_stock_search :  {use : false, title: ''}, // 자재 입출고관리에서 불러오는 stock_search
   
     
   });

  const stock_form_state : any = writable({
    uid : 0,
    lot : "",
    item : '',
    company : '',
    prev_factory : '',
    prev_factory_sub : '',
    after_factory : '',
    after_factory_sub : '',
    user : '',
    prev_qty : 0,
    after_qty : 0,
    unit : '',
    status : '',
    control_reason : '',


    
  })


 
  

  export {stock_modal_state,stock_form_state};