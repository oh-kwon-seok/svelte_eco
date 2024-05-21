

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const bom_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
    work_plan_bom_search : { use : false, title: ''}, // 생산계획에서 사용하는 팝업

   });

  const bom_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    item : '', // 제품 OR 자재
    code : '', 
    name : '',
    qty : 1,
    rate : 1,
    _children : [], // 서브데이터
    description : '', // 사용자이름
    used : 1,
    
  })
  

  export {bom_modal_state,bom_form_state};