

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const restric_material_country_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const restric_material_country_form_state : any = writable({
    uid : 0,
    regulate_type : '',
    regl_code : '',
    ingr_code : '',
    country_name : '',
    notice_ingr_name : '', 
    provis_atrcl : '',
    limit_cond : '',
    used : 1,
  
  })
  const restric_material_country_status_state : any  = writable({
    title : '',
    ing_count : 0,
    total_count : 0,
  
    final_total_count : 0,
    
  })
  

  export {restric_material_country_modal_state,restric_material_country_form_state,restric_material_country_status_state};