

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const work_plan_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
    work_task_work_plan_search : { use : false, title: ''}, // 생산지시에서 사용하는 팝업
    
    
     
   });

  const work_plan_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    user : '',
    bom_code : '',
    bom : '', // BOM
    qty : 1,
    unit : "G",
    start_date : moment().format('YYYY-MM-DD'),
    end_date : moment().format('YYYY-MM-DD'),
    
    used : 1,
    
  })
  

  export {work_plan_modal_state,work_plan_form_state};