

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const company_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const company_form_state : any = writable({
    uid : 0,
    code : '',
    name : '',
    owner_name : '',
    owner_phone : '',
    emp_name : '',
    emp_phone : '',
    fax : '', 
    email : '',
    type : '매출',
    used : 1,
  
  })
  

  export {company_modal_state,company_form_state};