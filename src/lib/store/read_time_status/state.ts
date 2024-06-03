

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
  ship_order_order_search : {use : false, title: ''}, // 출하지시에서 불러오는 주문 모달 

 
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

const temp_options : any = writable({
  chart: {
    type: 'bar',
    height: 350,
  },
  series: [
    {
      name: '개수',
      data: [],
    },
   
    
  ],
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
      barHeight: '10%', // 막대 높이 설정 (예: 50%)
      distributed: true // 막대 분산
    }
  },

  dataLabels: {
    enabled: true,
  },
  title: {
    text: '매출 현황', // 제목 텍스트
    align: 'center', // 제목 정렬 (left, center, right)
   
    offsetY: 15, // Y축 오프셋
    style: {
        fontSize: '20px', // 폰트 크기
        fontWeight: 'bold', // 폰트 두께
        color: '#263238' // 폰트 색상
    }
},

  
  xaxis: {
    label : {show : false},
    categories: []
  },

})
  

  export {temp_options,order_modal_state,order_form_state};