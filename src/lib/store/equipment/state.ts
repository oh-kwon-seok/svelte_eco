

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const equipment_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const equipment_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    name : '',
    purpose : '',
    description : '', // 사용자이름
    used : 1,
    
  })
  

  export {equipment_modal_state,equipment_form_state};