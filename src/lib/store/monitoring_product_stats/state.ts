

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';

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
    text: '생산 현황', // 제목 텍스트
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
  

  export {temp_options};