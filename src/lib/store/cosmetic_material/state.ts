

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const cosmetic_material_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const cosmetic_material_form_state : any = writable({
    uid : 0,
    
    ingr_kor_name : '',
    ingr_eng_name : '',
    cas_no : '',
    ingr_synonym : '',
    origin_major_kor_name : '',
    used : 1,
  
  })
  const cosmetic_material_status_state : any  = writable({
    title : '',
    ing_count : 0,
    total_count : 0,
  
    final_total_count : 0,
    
  })
  

  export {cosmetic_material_modal_state,cosmetic_material_form_state,cosmetic_material_status_state};