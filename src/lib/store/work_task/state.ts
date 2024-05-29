

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const work_task_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    
    stock_request : { use : false, title: ''},  // 자재불출승인 팝업
    measure : { use : false, title: ''}, // 계량지시 팝업
    production : { use : false, title: ''}, // 제조지시 팝업
    packing : { use : false, title: ''}, // 포장지시 팝업
    
    print : { use : false, title: ''}, // 생산실적 팝업
    
    check_delete : { use : false, title: ''},
     
   });

  const work_task_form_state : any = writable({
    uid : 0,
    modal: false,
    company : '', // 사업장
    user : '', // 계정정보
    work_plan_code : '',
    work_plan : '',
    
    bom_code : '',
    bom : '', // BOM
    task_qty : 1,
    barcode_scan : '',
    factory : '',
    factory_sub : '',
    
    success_qty : 0,
    fail_qty : 0,
    unit : "G",
    status : "준비",
    work_start_date : moment().format('YYYY-MM-DD'),
    work_end_date : moment().format('YYYY-MM-DD'),
    material_order : 0,
    measure_order : 0,
    production_order : 0,
    packing_order : 0,

  })
  

  export {work_task_modal_state,work_task_form_state};