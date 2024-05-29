

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
  xaxis: {
    label : {show : false},
    categories: [],
  },

})



  

  export {temp_options,humi_options,ph_options,weight_options};