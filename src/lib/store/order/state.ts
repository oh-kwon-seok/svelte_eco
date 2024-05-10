

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const order_modal_state : any = writable( {
    title : '',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
   
    check_delete : { use : false, title: ''},
    print : { use : false, title: ''},
   
   
   });

  const order_form_state : any = writable({
    uid : 0,
    modal: false,
    company : '', // 사업장
    customer : '', // 거래처
    estimate : '', // 견적서
    customer_name : '',

    user : '',
    code : '', // 견적코드
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    ship_date : moment().format('YYYY-MM-DD'), // 견적일자
   
    order_sub_array : [],
    used : 1,
    
  })
  

  export {order_modal_state,order_form_state};