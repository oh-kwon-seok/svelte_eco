

//@ts-nocheck

import { writable } from 'svelte/store';
import {stock_modal_state,stock_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state,common_factory_sub_state, common_factory_sub_filter_state} from '$lib/store/common/state';
import moment from 'moment';
import {loadChange} from '$lib/store/common/function';

import {TOAST_SAMPLE} from '$lib/module/common/constants';

import Excel from 'exceljs';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/stock/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';

const api = import.meta.env.VITE_API_BASE_URL;


let update_modal : any;
let update_form : any;
let alert : any;
let toast : any;

let login_data : any;
let table_list_data : any;
let search_data : any;
let selected_data : any;
let factory_sub_data : any;
let factory_sub_filter_data : any;

stock_modal_state.subscribe((data) => {
    update_modal = data;
})

stock_form_state.subscribe((data) => {
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

common_selected_state.subscribe((data) => {
  selected_data = data;
})
common_factory_sub_state.subscribe((data) => {
  factory_sub_data = data;
})

common_factory_sub_filter_state.subscribe((data) => {
  factory_sub_filter_data = data;
})
 
 
 
 



const stockModalOpen = (data : any, title : any) => {
 


     if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;

      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      stock_modal_state.update(() => update_modal);


         Object.keys(update_form).map((item)=> {    
             if(item === 'company' ){
               update_form[item] = data[item]['uid'];
             }else if(item === 'prev_factory'){
              update_form[item] = data['factory']['uid'];

              let filtered_data = factory_sub_data.filter((item) => {
                return item['factory']['uid'] === data['factory']['uid'];
              })
              console.log('filtered_data  :', filtered_data);
              factory_sub_filter_data = filtered_data;
              common_factory_sub_filter_state.update(()=> factory_sub_filter_data);


             }else if(item === 'after_factory'){
              update_form[item] = data['factory']['uid'];

        
             }else if(item === 'prev_factory_sub' || item === 'after_factory_sub'){
              update_form[item] = data['factorySub']['uid'];
             }
             
             else if(item === 'prev_qty'){
              update_form[item] = data['qty'];

             }else if(item === 'after_qty'){
              update_form[item] = 0;
             }
            
             else{
              console.log('item : ', item);
               update_form[item] = data[item];
             }
            
         }); 

    
 
             stock_form_state.update(() => update_form);
        
            
 
     }
     if(title === 'check_delete'){
      alert['type'] = 'save';
      alert['value'] = false;

      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      stock_modal_state.update(() => update_modal);
      
       let data =  table_list_data['stock'].getSelectedData();
 
       common_selected_state.update(() => data);
     
    }
 }





const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  stock_modal_state.update(() => update_modal);


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
      console.log('table_list_state : ', table_list_state['stock']);
      table_list_data[type].setData(res.data);
      table_list_state.update(() => table_list_data);
      console.log('table_list_data : ', table_list_data);
   })

}

const save = (param,title) => {
  param['company'] = getCookie('company_uid');
  param['user'] = getCookie('my-cookie');
  
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
   
  if(title === 'update'){

    if(parseFloat(param['after_qty']) === '' || parseFloat(param['after_qty']) === undefined || parseFloat(param['after_qty']) === null){
       return window.alert('조정수량을 확인해주세요');

    }else if(param['control_reason'] === ''){
      return window.alert('재고 조정 사유를 입력해주세요');

    }else if(param['after_factory_sub'] === '' || param['after_factory_sub'] === undefined){
      return window.alert('변경창고를 입력해주세요');

    }



    const url = `${api}/stock_control/save`
    
    try {

      let params = {
        uid : param.uid,
        company_uid : param.company,
        user_id : param.user,
        prev_factory_uid : param.prev_factory,
        prev_factory_sub_uid : param.prev_factory_sub,
        after_factory_uid : param.after_factory,
        after_factory_sub_uid : param.after_factory_sub,
        item_uid : param.item['uid'], 
        prev_qty : parseFloat(param.prev_qty),
        after_qty : parseFloat(param.after_qty),
        unit : param.unit,
        status : param.status,
        control_reason : param.control_reason,
        lot : param.lot,
        token : login_data['token'],
        
      };

     
    axios.post(url,
      params,
    ).then(res => {
      
      if(res.data !== undefined && res.data !== null && res.data !== '' ){
        console.log('실행');
        console.log('res:data', res.data);
        
        toast['type'] = 'success';
        toast['value'] = true;
        update_modal['title'] = '';
        update_modal['update']['use'] = false;
        stock_modal_state.update(() => update_modal);
        
        update_form = {
          uid : 0,
          lot : "",
          item : '',
          company : '',
          prev_factory : '',
          prev_factory_sub : '',
          after_factory : '',
          after_factory_sub : '',
          user : '',
          prev_qty : 0,
          after_qty : 0,
          unit : '',
          status : '',
          control_reason : '',
        };
        stock_form_state.update(()=> update_form);
        factory_sub_filter_data = '';

        common_factory_sub_filter_state.update(()=> factory_sub_filter_data)
        
        select_query('stock');
        return common_toast_state.update(() => toast);

      }else{
      
        return common_toast_state.update(() => TOAST_SAMPLE['fail']);
      }
    })
    }catch (e:any){
      return console.log('에러 : ',e);
    };

    


   
  }


 if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/stock/delete`
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
              update_modal['title'] = title;
              update_modal[title]['use'] = false;
              stock_modal_state.update(() => update_modal);
              stock_form_state.update(()=>update_form);

              select_query('stock');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            alert['type'] = 'error';
            alert['value'] = true;
            return common_alert_state.update(() => alert);
          };
    

        }
    }
  }


  
  const factoryChange = (key) => {
    let data = factory_sub_data.filter((item) => {
      return item['factory']['uid'] === key;
    })
    console.log('filter_data : ', data);
    factory_sub_filter_data = data;
    common_factory_sub_filter_state.update(()=> factory_sub_filter_data);
    if(data.length > 0){
      update_form['after_factory_sub'] = data[0]['uid'];
    }else{
      update_form['after_factory_sub'] = "";
    }
   

    
   }

  
const makeCustomTable = (table_list_state,type,tableComponent,select) => {

       
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




  



export {stockModalOpen,save,modalClose,makeCustomTable,factoryChange}