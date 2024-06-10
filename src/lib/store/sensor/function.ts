

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
import {temp_options,humi_options,ph_options,weight_options} from './state';

// import ApexCharts from 'apexcharts';


import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/stats/constants';

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
let humi_data : any;
let ph_data : any;
let weight_data : any;



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
humi_options.subscribe((data) => {
  humi_data = data;
})
ph_options.subscribe((data) => {
  ph_data = data;
})
weight_options.subscribe((data) => {
  weight_data = data;
})

 
 

const makeCustomTable = (table_list_state,type,tableComponent,select,temp_chart,humi_chart,ph_chart,weight_chart) => {


       
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

   


        let filter_temp_data = res.data.filter((item) => {
          return item['type'] === 'TEMP'
        })
        let filter_humi_data = res.data.filter((item) => {
          return item['type'] === 'HUMI'
        })
        let filter_ph_data = res.data.filter((item) => {
          return item['type'] === 'PH'
        })
        let filter_weight_data = res.data.filter((item) => {
          return item['type'] === 'WEIGHT'
        })

        console.log('filter_temp_data : ', filter_temp_data);

        let temp_data_array = [];
        let temp_regdate_array = [];

        let humi_data_array = [];
        let humi_regdate_array = [];

        let ph_data_array = [];
        let ph_regdate_array = [];

        let weight_data_array = [];
        let weight_regdate_array = [];
        
        if(filter_temp_data.length > 0){
          for(let i=0; i<filter_temp_data.length; i++){
              temp_data_array.push(parseFloat(filter_temp_data[i]['data']));
              temp_regdate_array.push(filter_temp_data[i]['created']);
              

          }
        }
        if(filter_humi_data.length > 0){
          for(let i=0; i<filter_humi_data.length; i++){
              humi_data_array.push(parseFloat(filter_humi_data[i]['data']));
              humi_regdate_array.push(filter_humi_data[i]['created']);
              

          }
        }
        if(filter_ph_data.length > 0){
          for(let i=0; i<filter_ph_data.length; i++){
              ph_data_array.push(parseFloat(filter_ph_data[i]['data']));
              ph_regdate_array.push(filter_ph_data[i]['created']);
              

          }
        }
        if(filter_weight_data.length > 0){
          for(let i=0; i<filter_weight_data.length; i++){
              weight_data_array.push(parseFloat(filter_weight_data[i]['data']));
              weight_regdate_array.push(filter_weight_data[i]['created']);
              

          }
        }

        temp_data['series'][0]['data'] = temp_data_array;
        temp_data['xaxis']['categories'] = temp_regdate_array;

        humi_data['series'][0]['data'] = humi_data_array;
        humi_data['xaxis']['categories'] = humi_regdate_array;

        ph_data['series'][0]['data'] = ph_data_array;
        ph_data['xaxis']['categories'] = ph_regdate_array;

        weight_data['series'][0]['data'] = weight_data_array;
        weight_data['xaxis']['categories'] = weight_regdate_array;
      
        temp_options.update(()=> temp_data);
        humi_options.update(()=> humi_data);
        ph_options.update(()=> ph_data);
        weight_options.update(()=> weight_data);
        console.log('tem_chart',temp_chart);
       
        if (temp_chart instanceof ApexCharts) temp_chart.destroy();
        if (humi_chart instanceof ApexCharts) humi_chart.destroy();
        if (ph_chart instanceof ApexCharts) ph_chart.destroy();
        if (weight_chart instanceof ApexCharts) weight_chart.destroy();

        console.log('temp_Chart : ', temp_chart);

        temp_chart = new ApexCharts(document.querySelector("#temp_chart"), temp_data);
        temp_chart.render();

        humi_chart = new ApexCharts(document.querySelector("#humi_chart"), humi_data);
        humi_chart.render();

        ph_chart = new ApexCharts(document.querySelector("#ph_chart"), ph_data);
        ph_chart.render();

        weight_chart = new ApexCharts(document.querySelector("#weight_chart"), weight_data);
        weight_chart.render();



   
        

       
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


const select_query = (type,temp_chart,humi_chart,ph_chart,weight_chart) => {
   
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
        let filter_temp_data = res.data.filter((item) => {
          return item['type'] === 'TEMP'
        })
        let filter_humi_data = res.data.filter((item) => {
          return item['type'] === 'HUMI'
        })
        let filter_ph_data = res.data.filter((item) => {
          return item['type'] === 'PH'
        })
        let filter_weight_data = res.data.filter((item) => {
          return item['type'] === 'WEIGHT'
        })

        console.log('filter_temp_data : ', filter_temp_data);

        let temp_data_array = [];
        let temp_regdate_array = [];

        let humi_data_array = [];
        let humi_regdate_array = [];

        let ph_data_array = [];
        let ph_regdate_array = [];

        let weight_data_array = [];
        let weight_regdate_array = [];
        
        if(filter_temp_data.length > 0){
          for(let i=0; i<filter_temp_data.length; i++){
              temp_data_array.push(parseFloat(filter_temp_data[i]['data']));
              temp_regdate_array.push(filter_temp_data[i]['created']);
              

          }
        }
        if(filter_humi_data.length > 0){
          for(let i=0; i<filter_humi_data.length; i++){
              humi_data_array.push(parseFloat(filter_humi_data[i]['data']));
              humi_regdate_array.push(filter_humi_data[i]['created']);
              

          }
        }
        if(filter_ph_data.length > 0){
          for(let i=0; i<filter_ph_data.length; i++){
              ph_data_array.push(parseFloat(filter_ph_data[i]['data']));
              ph_regdate_array.push(filter_ph_data[i]['created']);
              

          }
        }
        if(filter_weight_data.length > 0){
          for(let i=0; i<filter_weight_data.length; i++){
              weight_data_array.push(parseFloat(filter_weight_data[i]['data']));
              weight_regdate_array.push(filter_weight_data[i]['created']);
              

          }
        }

        temp_data['series'][0]['data'] = temp_data_array;
        temp_data['xaxis']['categories'] = temp_regdate_array;

        humi_data['series'][0]['data'] = humi_data_array;
        humi_data['xaxis']['categories'] = humi_regdate_array;

        ph_data['series'][0]['data'] = ph_data_array;
        ph_data['xaxis']['categories'] = ph_regdate_array;

        weight_data['series'][0]['data'] = weight_data_array;
        weight_data['xaxis']['categories'] = weight_regdate_array;
      
        temp_options.update(()=> temp_data);
        humi_options.update(()=> humi_data);
        ph_options.update(()=> ph_data);
        weight_options.update(()=> weight_data);

        console.log('temp_data : ', temp_data);
        console.log('humi_data : ', humi_data);
        console.log('ph_data : ', ph_data);
        if (temp_chart instanceof ApexCharts) temp_chart.destroy();
        if (humi_chart instanceof ApexCharts) humi_chart.destroy();
        if (ph_chart instanceof ApexCharts) ph_chart.destroy();
        if (weight_chart instanceof ApexCharts) weight_chart.destroy();


        temp_chart = new ApexCharts(document.querySelector("#temp_chart"), temp_data);
        temp_chart.render();

        humi_chart = new ApexCharts(document.querySelector("#humi_chart"), humi_data);
        humi_chart.render();

        ph_chart = new ApexCharts(document.querySelector("#ph_chart"), ph_data);
        ph_chart.render();

        weight_chart = new ApexCharts(document.querySelector("#weight_chart"), weight_data);
        weight_chart.render();

          
      table_list_data['sensor'].setData(res.data);
      table_list_state.update(() => table_list_data);
      }else{
        table_list_data['sensor'].setData([]);
        table_list_state.update(() => table_list_data);
      }
   
      
   })

}













export {  makeCustomTable,select_query}
