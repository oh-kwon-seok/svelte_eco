

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';
import moment from 'moment';

const temp_options : any = writable({
  chart: {
    type: 'area',
    height: 350,
  },
  series: [
    {
      name: '온도',
      data: [],
    },
   
    
  ],
  colors: ['#F57878'],

  dataLabels: {
    enabled: true,
  },
  title: {
    text: '온도 데이터', // 제목 텍스트
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
const humi_options : any = writable({
  chart: {
    type: 'area',
    height: 350,
  },
  series: [
    {
      name: '습도',
      data: [],
    },
    
  ],
  colors: ['#77B6EA'],

  dataLabels: {
    enabled: true,
  },
  markers: {
    size: 1
  },
  title: {
    text: '습도 데이터', // 제목 텍스트
    align: 'center', // 제목 정렬 (left, center, right)
   
    offsetY: 15, // Y축 오프셋
    style: {
        fontSize: '20px', // 폰트 크기
        fontWeight: 'bold', // 폰트 두께
        color: '#77B6EA' // 폰트 색상
    }
},
  xaxis: {
    label : {show : false},
    categories: [],
  },

})

const ph_options : any = writable({
  chart: {
    type: 'area',
    height: 350,
  },
  series: [
    {
      name: 'PH',
      data: [],
    },
    
  ],
  colors: ['#BC55EF'],

  dataLabels: {
    enabled: true,
  },
  markers: {
    size: 1
  }, 
  
  title: {
    text: 'PH 데이터', // 제목 텍스트
    align: 'center', // 제목 정렬 (left, center, right)
   
    offsetY: 15, // Y축 오프셋
    style: {
        fontSize: '20px', // 폰트 크기
        fontWeight: 'bold', // 폰트 두께
        color: '#BC55EF' // 폰트 색상
    }
},
  xaxis: {
    label : {show : false},
    categories: []  ,
  },

})

const weight_options : any = writable({
  chart: {
    type: 'area',
    height: 350,
  },
  series: [
    {
      name: '전자저울',
      data: [],
    },
    
  ],
  colors: ['#464646', ],

  dataLabels: {
    enabled: true,
  },
  markers: {
    size: 1
  },
  title: {
    text: '전자저울 데이터', // 제목 텍스트
    align: 'center', // 제목 정렬 (left, center, right)
   
    offsetY: 15, // Y축 오프셋
    style: {
        fontSize: '20px', // 폰트 크기
        fontWeight: 'bold', // 폰트 두께
        color: '#464646' // 폰트 색상
    }
},
  xaxis: {
    label : {show : false},
    categories: [],
  },

})



  

  export {temp_options,humi_options,ph_options,weight_options};