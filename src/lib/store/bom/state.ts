

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const bom_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const bom_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    item : '', // 제품 OR 자재
    code : '', 
    name : '',
    
    description : '', // 사용자이름
    used : 1,
    
  })
  

  export {bom_modal_state,bom_form_state};