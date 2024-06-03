

//@ts-nocheck

import { writable } from 'svelte/store';


import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,common_factory_sub_state, common_factory_sub_filter_state} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE,CLIENT_INFO} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {temp_options} from './state';

import ApexCharts from 'apexcharts';


import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/monitoring/product_status/constants';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;

let update_form : any;

let alert : any;
let toast : any;

let login_data : any;
let table_list_data : any;
let table_modal_data : any;

let selected_data : any;
let search_data : any;
let work_plan_modal : any;

let factory_sub_data : any;
let factory_sub_filter_data : any;
let temp_data : any;



common_alert_state.subscribe((data) => {
  alert = data;
})
common_toast_state.subscribe((data) => {
  toast = data;
})

common_search_state.subscribe((data) => {
  search_data = data;
})

login_state.subscribe((data) => {
  login_data = data;table_modal_state
})
table_list_state.subscribe((data) => {
  table_list_data = data;
})
table_modal_state.subscribe((data) => {
  table_modal_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})


common_factory_sub_state.subscribe((data) => {
  factory_sub_data = data;
})

common_factory_sub_filter_state.subscribe((data) => {
  factory_sub_filter_data = data;
})
temp_options.subscribe((data) => {
  temp_data = data;
})
 

const makeCustomTable = (table_list_state,type,tableComponent,select,temp_chart) => {
       
  const url = `${api}/${type}/${select}`; 
  
  search_data['filter'] = TABLE_FILTER[type];
  
  common_search_state.update(() => search_data);
 let start_date= moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');
 let end_date= moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');;
 
  let search_text = search_data['search_text'];
  let filter_title = search_data['filter_title'];

  let params = 
  {
    start_date : start_date,
    end_date : end_date,
    search_text : search_text,
    filter_title : filter_title,   
  };

 
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }
   axios.get(url,config).then(res=>{
      
      console.log('res : ', res.data);
     
      if(res.data.length > 0){

        let temp_data_array = [];
        let temp_status_array = [];

        for (let i = 0; i < res.data.length; i++) {
          let code = res.data[i].bom.code;
          if (!temp_status_array.includes(code)) {
            temp_status_array.push(code);
          }
        } 

        // let temp_status_array = ['준비','진행중','생산완료'];

        let statusSum = {};
      
        temp_status_array.forEach(status => {
            statusSum[status] = 0;
        });
    
        for (let i = 0; i < res.data.length; i++) {
            let taskQty = 1;
            let status = res.data[i].bom.code;
            
            if (temp_status_array.includes(status)) {
                statusSum[status] += taskQty;
            }
        }

        temp_data_array = temp_status_array.map(status => statusSum[status]);

        temp_data['series'][0]['data'] = temp_data_array;
        temp_data['xaxis']['categories'] = temp_status_array;

        temp_options.update(()=> temp_data);
       
        if (temp_chart instanceof ApexCharts) temp_chart.destroy();

        console.log('temp_Chart : ', temp_chart);

        temp_chart = new ApexCharts(document.querySelector("#temp_chart"), temp_data);
        temp_chart.render();
       
        if(table_list_state[type]){
          table_list_state[type].destory();
        }

        
        table_list_data[type] =   new Tabulator(tableComponent, {
        height:TABLE_TOTAL_CONFIG['height'],
        layout:TABLE_TOTAL_CONFIG['layout'],
        pagination:TABLE_TOTAL_CONFIG['pagination'],
        paginationSize:TABLE_TOTAL_CONFIG['paginationSize'],
        paginationSizeSelector:TABLE_TOTAL_CONFIG['paginationSizeSelector'],
        movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
        paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
        paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
        locale: TABLE_TOTAL_CONFIG['locale'],
        langs: TABLE_TOTAL_CONFIG['langs'],
        selectable: true,
       
        rowClick:function(e, row){
          //e - the click event object
          //row - row component
       
          row.toggleSelect(); //toggle row selected state on row click
      },

        rowFormatter:function(row){
              //row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     

        data : res.data,
      
        columns: TABLE_HEADER_CONFIG[type],
        
   
       
        });
        
        table_list_state.update(()=> table_list_data);

    
      
        
  }else{
    
    if(table_list_state[type]){
      table_list_state[type].destory();
    }

    table_list_data[type] =   new Tabulator(tableComponent, {
      height:TABLE_TOTAL_CONFIG['height'],
      layout:TABLE_TOTAL_CONFIG['layout'],
      pagination:TABLE_TOTAL_CONFIG['pagination'],
      paginationSize:TABLE_TOTAL_CONFIG['paginationSize'],
      paginationSizeSelector:TABLE_TOTAL_CONFIG['paginationSizeSelector'],
      movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
      paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
      paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
      locale: TABLE_TOTAL_CONFIG['locale'],
      langs: TABLE_TOTAL_CONFIG['langs'],
      selectable: true,
      placeholder:"데이터 없음",
      rowClick:function(e, row){
        //e - the click event object
        //row - row component
     
        row.toggleSelect(); //toggle row selected state on row click
    },

      rowFormatter:function(row){
            row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
      },
   

      data : [],
    
      columns: TABLE_HEADER_CONFIG[type],
      

      });
      
      table_list_state.update(()=> table_list_data);


 
  }
   })

  
}


const select_query = (type,temp_chart) => {

  const url = `${api}/${type}/select`; 
        
  search_data['filter'] = TABLE_FILTER[type];
        
  common_search_state.update(() => search_data);

  let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

  let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');
  let search_text = search_data['search_text'];
  let filter_title = search_data['filter_title'];

  let params = 
  {
    start_date : start_date,
    end_date  : end_date,
    search_text : search_text,
    filter_title : filter_title,   
  };
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      if(res.data.length > 0){

        let temp_data_array = [];
        let temp_status_array = [];

        let statusSum = {};

        for (let i = 0; i < res.data.length; i++) {
          let code = res.data[i].bom.code;
          if (!temp_status_array.includes(code)) {
            temp_status_array.push(code);
          }
        } 
      
          temp_status_array.forEach(status => {
              statusSum[status] = 0;
          });
      
          for (let i = 0; i < res.data.length; i++) {
              let taskQty = 1;
              let status = res.data[i]['status'];
              
              if (temp_status_array.includes(status)) {
                  statusSum[status] += taskQty;
              }
          }

        temp_data_array = temp_status_array.map(status => statusSum[status]);

        temp_data['series'][0]['data'] = temp_data_array;
        temp_data['xaxis']['categories'] = temp_status_array;
      
        temp_options.update(()=> temp_data);

        console.log('temp_data : ', temp_data);

        if (temp_chart instanceof ApexCharts) temp_chart.destroy();

        temp_chart = new ApexCharts(document.querySelector("#temp_chart"), temp_data);
        temp_chart.render();
          
      table_list_data['work_task'].setData(res.data);
      table_list_state.update(() => table_list_data);
      }else{
        table_list_data['work_task'].setData([]);
        table_list_state.update(() => table_list_data);
      }
   
      
   })

}













export {  makeCustomTable,select_query}