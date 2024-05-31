

//@ts-nocheck

import { writable } from 'svelte/store';
import {equipment_runtime_modal_state,equipment_runtime_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state,} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_FILTER,TABLE_HEADER_CONFIG} from '$lib/module/equipment/constants';
import {runtime_options} from './state';
import ApexCharts from 'apexcharts';

import Excel from 'exceljs';
const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_data : any;
let login_data : any;
let table_list_data : any;
let equipment_runtime_data : any;
let equipment_runtime_upload_data : any;
let selected_data : any;
let runtime_data : any;

const init_form_data:any = {
  uid : 0,
  company : '', // 사업장
  equipment : '',
  start_time : '',
  end_time : '',
  runtime_second : 0,
  used : 1,


}


equipment_runtime_modal_state.subscribe((data) => {
    update_modal = data;
})

equipment_runtime_form_state.subscribe((data) => {
    update_form = data;
})


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
  login_data = data;
})
table_list_state.subscribe((data) => {
  table_list_data = data;
})


common_selected_state.subscribe((data) => {
  selected_data = data;
})
runtime_options.subscribe((data) => {
  runtime_data = data;
})
 
const makeCustomTable = (table_list_state,type,tableComponent,select,runtime_chart) => {

       
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

        let result = {};
        res.data.forEach(item => {
          if (result[item['equipment']['name']]) {
              result[item['equipment']['name']].total += item['runtime_second'];
              result[item['equipment']['name']].count += 1;
          } else {
              result[item['equipment']['name']] = {
                  total: item['runtime_second'],
                  count: 1
              };
          }
      });

      
      let series_data = [];
      let categories = [];
      // 평균 계산
      for (const key in result) {
          result[key] = Math.floor(result[key].total / result[key].count / 3600); // 시간단위로 나눔
          series_data.push(result[key]);
          categories.push(key);
      }

      console.log('series : ', series_data);

      console.log('r runtime_data : ',  runtime_data,categories);

      runtime_data['series'][0]['data']  =  series_data;
      runtime_data['series'][0]['name']  =  "평균 가동 시간";
      
      runtime_data['xaxis']['categories'] = categories;
  
      runtime_options.update(()=> runtime_data);
      if (runtime_chart instanceof ApexCharts) runtime_chart.destroy();

      runtime_chart = new ApexCharts(document.querySelector("#runtime_chart"), runtime_data);
      runtime_chart.render();
       
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


const equipmentRuntimeModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    equipment_runtime_modal_state.update(() => update_modal);

   
    if(title === 'add'){
      update_form = init_form_data;
      equipment_runtime_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){



        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'equipment'){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            equipment_runtime_form_state.update(() => update_form);
            equipment_runtime_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      let data =  table_list_data['equipment_runtime'].getSelectedData();

      common_selected_state.update(() => data);
    
  }
}







const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  update_form = init_form_data;
  common_alert_state.update(() => alert);
  equipment_runtime_modal_state.update(() => update_modal);
  equipment_runtime_form_state.update(() => update_form);
  


}






const save = (param,title) => {
  param['company'] = getCookie('company_uid');

  console.log('param : ', param);
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if(  param['company'] === '' || param['equipment'] === '' || param['start_time'] === '' || param['end_time'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        equipment_runtime_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/equipment_runtime/save`
        try {


          const startTime = moment(param.start_time);
          const endTime = moment(param.end_time);
      
          // 두 시간의 차이를 밀리초로 계산
          const diffInMilliseconds = endTime.diff(startTime);
      
          // 밀리초를 초 단위로 변환하여 총 시간 계산
          const totalSeconds = Math.floor(diffInMilliseconds / 1000); // 연산된 초
      
          

  
          
          let params = {
          
            company_uid : param.company,
            equipment_uid : param.equipment,
            start_time : param.start_time,
            end_time : param.end_time,
            runtime_second : totalSeconds,      
            used : param.used,
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          console.log('res',res);
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
            console.log('실행');
            console.log('res:data', res.data);
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            equipment_runtime_modal_state.update(() => update_modal);

            select_query('equipment_runtime');

            return common_toast_state.update(() => toast);

          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){
      const url = `${api}/equipment_runtime/update`

      const startTime = moment(param.start_time);
      const endTime = moment(param.end_time);
  
      // 두 시간의 차이를 밀리초로 계산
      const diffInMilliseconds = endTime.diff(startTime);
  
      // 밀리초를 초 단위로 변환하여 총 시간 계산
      const totalSeconds = Math.floor(diffInMilliseconds / 1000); // 연산된 초
      
     
      
    
      try {

      
        let params = {
          uid : param.uid,
          company_uid : param.company,
          equipment_uid : param.equipment,
          start_time : param.start_time,
          end_time : param.end_time,
          runtime_second :  totalSeconds,      
          used : param.used,
          token : login_data['token'],
          
        };
      axios.post(url,
        params,
      ).then(res => {
        console.log('res',res);
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          console.log('실행');
          console.log('res:data', res.data);
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          equipment_runtime_modal_state.update(() => update_modal);
          update_form = init_form_data;
          equipment_runtime_form_state.update(()=> update_form);
          select_query('equipment_runtime');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      }catch (e:any){
        return console.log('에러 : ',e);
      };


     
    }if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        return common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/equipment_runtime/delete`
          try {
    
            let params = {
              uid : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            console.log('res',res);
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              console.log('실행');
              console.log('res:data', res.data);
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              equipment_runtime_modal_state.update(() => update_modal);
              update_form = init_form_data;
              equipment_runtime_form_state.update(()=> update_form);

              select_query('equipment_runtime');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    
        }

      
    }
  }



  


  const select_query = (type) => {
   
    const url = `${api}/${type}/select`; 
          
    let basic_date = moment().subtract(90,'days');
    
  
    
    let start_date = basic_date.format('YYYY-MM-DDTHH:mm:ss');
    let end_date = basic_date.add(150,'days').format('YYYY-MM-DDTHH:mm:ss');
  
  
    let params = 
    {
      start_date : start_date,
      end_date  : end_date
    };
    const config = {
      params : params,
      headers:{
        "Content-Type": "application/json",
        
      }
    }
      axios.get(url,config).then(res=>{
        console.log('table_list_state : ', table_list_state['estimate']);
        table_list_data[type].setData(res.data);
        table_list_state.update(() => table_list_data);
        console.log('table_list_data : ', table_list_data);
     })
  
  }
  
  


export {equipmentRuntimeModalOpen,save,modalClose,makeCustomTable}