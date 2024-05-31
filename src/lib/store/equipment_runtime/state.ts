

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';


const runtime_options : any = writable({
  chart: {
    type: 'bar',
    height: 600,
    width: '100%', // 차트 너비 설정

  },
  series: [
    {
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
    formatter: function(val : any, opt : any) {
      var unit = ""; // 데이터 형식에 따른 단위
      // if (opt.dataPointIndex > 0) {
      //   unit = "시간";
      // } 
      return val + "시간";
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      //colors: ["#304758"]
    }
  },

  xaxis: {
    labels: {
      formatter: function(val:any) {
        return val+"시간"; // 이 부분에 원하는 형식의 데이터 설명을 반환하는 함수를 작성
      }
    },
    categories: []
  },

  yaxis: {
    title: {
      text: '설비명'
    }
  },


})

  const equipment_runtime_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const equipment_runtime_form_state : any = writable({
    uid : 0,
    company : '', // 사업장
    equipment : '',
    start_time : '',
    end_time : '',
    runtime_second : 0,
    used : 1,
    
  })
  

  export {equipment_runtime_modal_state,equipment_runtime_form_state,runtime_options};