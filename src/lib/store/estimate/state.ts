

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const estimate_modal_state : any = writable( {
    title : '',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
   
    check_delete : { use : false, title: ''},
    print : { use : false, title: ''},
   
   
   });

  const estimate_form_state : any = writable({
    uid : 0,
    modal: false,
    company : '', // 사업장
    customer : '',
    customer_name : '',

    user : '',
    code : '', // 견적코드
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    estimate_date : moment().format('YYYY-MM-DD'), // 견적일자
    expire : "", //유효기간 
    estimate_sub_array : [],
    used : 1,
    
  })
  

  export {estimate_modal_state,estimate_form_state};