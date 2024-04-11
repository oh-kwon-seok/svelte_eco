

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const process_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const process_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
   
    name : '',
    stauts : '',
    process_qc_array : [],
    description : '', // 사용자이름
    used : 1,
    
  })
  

  export {process_modal_state,process_form_state};