

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';


  const ship_order_modal_state : any = writable( {
    title : '',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
   
    check_delete : { use : false, title: ''},
    print : { use : false, title: ''},
   
   
   });

  const ship_order_form_state : any = writable({
    uid : 0,
    modal: false,
    company : '', // 사업장
    customer : '', // 거래처
    order : '', // 주문서
    customer_name : '',
    barcode_scan : '',
    user : '',
    code : '', // 견적코드
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    order_ship_date : moment().format('YYYY-MM-DD'), //  계약상 납품일자
    ship_date : moment().format('YYYY-MM-DD'), //  실제납품일자
    order_count : 0, // 납기일자 차이
    ship_order_sub_array : [],
    used : 1,
    
  })
  

  export {ship_order_modal_state,ship_order_form_state};