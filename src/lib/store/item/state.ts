

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
        code :  "",
        simple_code :  "",
        ingr_kor_name :  "",
        ingr_eng_name :  "",
        inout_unit :  "",
        inout_type :  "",
        currency_unit :   "",
        buy_type :  "",
        type_code :  "",
        classify_code :  "",
        component_code :  "",
        hs_code : "",
        nts_code : "",
        description : "",
        company : "",
        type : "",
        used : 1,

  })
  

  export {item_modal_state,item_form_state};