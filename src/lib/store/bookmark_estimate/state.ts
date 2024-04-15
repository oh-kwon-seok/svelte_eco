

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const bookmark_estimate_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const bookmark_estimate_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    user : '',
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    bookmark_estimate_sub_array : [],
    used : 1,
    
  })
  

  export {bookmark_estimate_modal_state,bookmark_estimate_form_state};