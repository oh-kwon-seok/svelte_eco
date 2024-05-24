

//@ts-nocheck

import { writable } from 'svelte/store';
import {work_task_modal_state,work_task_form_state} from './state';
import {work_plan_modal_state} from '$lib/store/work_plan/state';

import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,production_work_task_state,common_factory_sub_state, common_factory_sub_filter_state} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE,CLIENT_INFO} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';


import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/production/constants';
import Excel from 'exceljs';
const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;

let update_form : any;
let list_data : any;
let alert : any;
let toast : any;

let login_data : any;
let table_list_data : any;
let table_modal_data : any;
let work_task_data : any;
let work_task_upload_data : any;
let work_task_sub_upload_data : any;
let restric_material_data;

let selected_data : any;
let search_data : any;
let work_plan_modal : any;

let company_modal : any;

let estimate_modal : any;


let factory_sub_data : any;
let factory_sub_filter_data : any;



let init_form_data:any = {
  uid : 0,
  company : '', // 사업장
  user : '', // 계정정보
  barcode_scan : '',
  work_plan : '',
  work_plan_code : '',
  bom_code : '',
  bom : '', // BOM
  task_qty : 1,
  success_qty : 0,
  fail_qty : 0,
  unit : "G",
  status : "준비",
  work_start_date : moment().format('YYYY-MM-DD'),
  work_end_date : moment().format('YYYY-MM-DD'),
  material_order : 0,
  measure_order : 0,
  production_order : 0,
  packing_order : 0,

}

let init_work_task_uid :any ;

work_task_modal_state.subscribe((data) => {
    update_modal = data;
})

work_task_form_state.subscribe((data) => {
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
  login_data = data;table_modal_state
})
table_list_state.subscribe((data) => {
  table_list_data = data;
})
table_modal_state.subscribe((data) => {
  table_modal_data = data;
})
production_work_task_state.subscribe((data) => {
  work_task_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

work_plan_modal_state.subscribe((data) => {
  work_plan_modal = data;
})

common_factory_sub_state.subscribe((data) => {
  factory_sub_data = data;
})

common_factory_sub_filter_state.subscribe((data) => {
  factory_sub_filter_data = data;
})
 
 

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


const workTaskModalOpen = (data : any, title : any) => {
   
    if(title === 'add'){
       
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);
   
      update_form = {
        modal: false,
        uid : 0,
        work_plan : '',
        work_plan_code : '',
        barcode_scan : '',
        user : '', // 계정정보
        company : '', // 사업장
        bom_code : '',
        bom : '', // BOM
        task_qty : 1,
        success_qty : 0,
        fail_qty : 0,
        unit : "G",
        status : "준비",
        work_start_date : moment().format('YYYY-MM-DD'),
        work_end_date : moment().format('YYYY-MM-DD'),
        material_order : 0,
        measure_order : 0,
        production_order : 0,
        packing_order : 0,
      };

      work_task_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);

    console.log('update_form : ', update_form);

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'user'){
              update_form[item] = data['user']['id'];
            
          

            }else if(item === 'work_plan'){
              update_form[item] = data['workPlan']['uid'];
            
              console.log('data[item] : ', data[item]);

            }else if(item === 'work_plan_code'){
              update_form['work_plan_code'] = data['workPlan']['code'];
              console.log('data[item] : ', data[item]);

            }else if(item === 'bom'){
              
            

              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 

            work_task_form_state.update(() => update_form);
            work_task_modal_state.update(() => update_modal);
           

    }
    if(title === 'stock_request' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);

    console.log('update_form : ', update_form);

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'user'){
              update_form[item] = data['user']['id'];
            
          

            }else if(item === 'work_plan'){
              update_form[item] = data['workPlan']['uid'];
            
              console.log('data[item] : ', data[item]);

            }else if(item === 'work_plan_code'){
              update_form['work_plan_code'] = data['workPlan']['code'];
              console.log('data[item] : ', data[item]);

            }else if(item === 'bom'){
              
            

              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 
        update_form['modal'] = false;
       
        update_form['barcode_scan'] = '',
        update_form['factory'] = '',
        update_form['factory_sub'] = '',
        
            work_task_form_state.update(() => update_form);
            work_task_modal_state.update(() => update_modal);
           

    }  if(title === 'measure' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);

    console.log('update_form : ', update_form);

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'user'){
              update_form[item] = data['user']['id'];
            
          

            }else if(item === 'work_plan'){
              update_form[item] = data['workPlan']['uid'];
            
              console.log('data[item] : ', data[item]);

            }else if(item === 'work_plan_code'){
              update_form['work_plan_code'] = data['workPlan']['code'];
              console.log('data[item] : ', data[item]);

            }else if(item === 'bom'){
              
            

              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 
        update_form['modal'] = false;
       
        update_form['barcode_scan'] = '',
        update_form['factory'] = '',
        update_form['factory_sub'] = '',
        
            work_task_form_state.update(() => update_form);
            work_task_modal_state.update(() => update_modal);
           

    }
    if(title === 'production' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);

   
        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'user'){
              update_form[item] = data['user']['id'];
            
          

            }else if(item === 'work_plan'){
              update_form[item] = data['workPlan']['uid'];
            
         

            }else if(item === 'work_plan_code'){
              update_form['work_plan_code'] = data['workPlan']['code'];
         
            }else if(item === 'bom'){
              
            
              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 
        update_form['modal'] = false;
       
        update_form['barcode_scan'] = '',
        update_form['factory'] = '',
        update_form['factory_sub'] = '',
        
            work_task_form_state.update(() => update_form);
            work_task_modal_state.update(() => update_modal);
           

    }
    if(title === 'packing' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_task_modal_state.update(() => update_modal);

   
        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'user'){
              update_form[item] = data['user']['id'];
            
          

            }else if(item === 'work_plan'){
              update_form[item] = data['workPlan']['uid'];
            
         

            }else if(item === 'work_plan_code'){
              update_form['work_plan_code'] = data['workPlan']['code'];
         
            }else if(item === 'bom'){
              
            
              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 
        update_form['modal'] = false;
       
        update_form['barcode_scan'] = '',
        update_form['factory'] = '',
        update_form['factory_sub'] = '',
        
            work_task_form_state.update(() => update_form);
            work_task_modal_state.update(() => update_modal);
           

    }

    if(title === 'check_delete'){
      alert['type'] = 'check_delete';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      work_task_modal_state.update(() => update_modal);



      let data =  table_list_data['work_task'].getSelectedData();

      common_selected_state.update(() => data);
    
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
      console.log('table_list_state : ', table_list_state['work_task']);
      table_list_data[type].setData(res.data);
      table_list_state.update(() => table_list_data);
      console.log('table_list_data : ', table_list_data);
   })

}



const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  update_form = init_form_data;
  common_alert_state.update(() => alert);


  work_task_modal_state.update(() => update_modal);
  work_task_form_state.update(() => update_form);
  
}



const save =  (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid');
  param['user'] = getCookie('my-cookie');
  

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if( param['bom'] === '' ||  param['company'] === ''  || param['work_plan'] === '' || param['user'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        work_task_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
  

        const url = `${api}/work_task/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            work_plan_uid : param['work_plan'],
            bom_uid : param['bom'],
            user_id : param['user'],
            task_qty : parseFloat(param['task_qty']),

            
            work_start_date : param['work_start_date'],
            work_end_date : param['work_end_date'],
            unit : param['unit'],
            material_order: 0,
            measure_order: 0,
            production_order: 0,
            packing_order: 0,
            
     
            token : login_data['token'],
          };

          console.log('params',params);
        axios.post(url,
          params,
        ).then(res => {
          console.log('res',res);
          if(res.data !== undefined && res.data !== null && res.data !== '' && res.data.success === true){
            console.log('실행');
            console.log('res:data', res.data);
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            
            work_task_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
            barcode_scan : '',
            work_plan : '',
            work_plan_code : '',
            company : '', // 사업장
            user : '', // 계정정보
            bom_code : '',
            bom : '', // BOM
            task_qty : 1,
            success_qty : 0,
            fail_qty : 0,
            unit : "G",
            status : "준비",
            work_start_date : moment().format('YYYY-MM-DD'),
            work_end_date : moment().format('YYYY-MM-DD'),
            material_order : 0,
            measure_order : 0,
            production_order : 0,
            packing_order : 0,
            };
           
            work_task_form_state.update(()=> update_form);


            return common_toast_state.update(() => toast);

          }else{
            alert['value'] = true;
            if(res.data.msg === 'code'){
              alert['type'] = 'code';
            }else if(res.data.msg === 'error'){
              alert['type'] = 'error';
           
            }else{
              alert['type'] = 'save';
            }
          

            return common_alert_state.update(() => alert);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){

      if( param['bom'] === '' ||  param['company'] === ''  || param['user'] === '' || param['work_plan'] === ''){
      
        alert['type'] = 'save';
        alert['value'] = true;
        work_task_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
   
        const url = `${api}/work_task/update`

      
        try {
  
        
          let params = {
            uid : param.uid,
            company_uid : parseInt(param['company']),
            work_plan_uid : param['work_plan'],
            bom_uid : param['bom'],
            user_id : param['user'],
            task_qty : parseFloat(param['task_qty']),
            success_qty : parseFloat(param['success_qty']),
            fail_qty : parseFloat(param['fail_qty']),
            work_start_date : param['work_start_date'],
            work_end_date : param['work_end_date'],
            unit : param['unit'],
            status : param['status'],
            material_order : parseInt(param['material_order']),
            measure_order : parseInt(param['measure_order']),
            prodution_order : parseInt(param['production_order']),
            packing_order : parseInt(param['packing_order']),
          
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
            work_task_modal_state.update(() => update_modal);
            update_form = init_form_data;
            work_task_form_state.update(()=> update_form);
            select_query('work_task');
            return common_toast_state.update(() => toast);
  
          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };

      }
      
    


     
    }if(title === 'check_delete'){
      let data =  selected_data;


      let uid_array = [];

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

          const url = `${api}/work_task/delete`
          try {
    
            let params = {
              uid : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              work_task_modal_state.update(() => update_modal);
              work_task_form_state.update(()=>update_form);

              select_query('work_task');
    
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
    if(title === 'print'){
      let data = selected_data;

      if(data.length === 0){
        alert['type'] = 'print';
        alert['value'] = true;

        return common_alert_state.update(() => alert);
   
      
      }else{
        printContent(data);    
      }
    
        
    } 




  }


  const cancelSave =  (param,title) => {

    param['company'] = getCookie('company_uid');
    param['user'] = getCookie('my-cookie');
    
  

  
  
        if( param['bom'] === '' ||  param['company'] === ''  || param['user'] === '' || param['work_plan'] === ''){
        
          alert['type'] = 'save';
          alert['value'] = true;
          work_task_modal_state.update(() => update_modal);
   
          return common_alert_state.update(() => alert);
    
        }else {
     
          const url = `${api}/work_task/update`
  
        
          try {
    
          
            let params = {
              uid : param.uid,
              company_uid : parseInt(param['company']),
              work_plan_uid : param['work_plan'],
              bom_uid : param['bom'],
              user_id : param['user'],
              task_qty : parseFloat(param['task_qty']),
              success_qty : parseFloat(param['success_qty']),
              fail_qty : parseFloat(param['fail_qty']),
              work_start_date : param['work_start_date'],
              work_end_date : param['work_end_date'],
              unit : param['unit'],
              status : param['status'],
              material_order : 0, // 자재 출고 반려처리함
              measure_order : parseInt(param['measure_order']),
              prodution_order : parseInt(param['production_order']),
              packing_order : parseInt(param['packing_order']),
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
              work_task_modal_state.update(() => update_modal);
              update_form = init_form_data;
              work_task_form_state.update(()=> update_form);
              select_query('work_task');
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

    const approvalSave =  (param,title) => {

      param['company'] = getCookie('company_uid');
      param['user'] = getCookie('my-cookie');

      
      let stock_request_data = table_modal_data['stock_request'].getData();
      let stock_approval_data = table_modal_data['stock_approval'].getData();


      if(stock_approval_data.length > 0){
        let alert = [];
        for(let i=0; i<stock_approval_data.length; i++){
          stock_approval_data[i]['out_qty'] = parseFloat(stock_approval_data[i]['out_qty']);
          let itemCheck = stock_request_data.find(item => item['item']['uid'] === stock_approval_data[i]['item']['uid']);
          stock_approval_data[i]['out_qty'] = parseFloat(stock_approval_data[i]['out_qty']);
          if(itemCheck){
            if(stock_approval_data[i]['prev_qty'] < stock_approval_data[i]['out_qty']){
              return window.alert(stock_approval_data[i]['lot'] + '는 현재고보다 불출수량이 많습니다.');

            }
          }else{
            
            alert.push(stock_approval_data[i]['item']['uid']);
          }
        }

        if(alert.length > 0){
          return window.alert(alert.length+"개 만큼 품목이 부족합니다. 품목을 더 선택해주십시오.");

        }
        
        const url = `${api}/work_task/material_approval`

        console.log('stock_approval_data : ', stock_approval_data);

        try {
          
          let params = {
            uid : param.uid,
            company_uid : parseInt(param['company']),
            user_id : param['user'],
            
            
            task_qty : parseFloat(param['task_qty']),
            stock_approval : stock_approval_data,
            unit : param['unit'],
            status : param['status'],
            material_order : 2, // 자재 출고 승인처리함
            
            prodution_order : parseInt(param['production_order']),
            packing_order : parseInt(param['packing_order']),
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
            work_task_modal_state.update(() => update_modal);
            update_form = init_form_data;
            work_task_form_state.update(()=> update_form);
            select_query('work_task');
            return common_toast_state.update(() => toast);
  
          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };

    


      }else{
        return window.alert('출고할 품목이 없습니다.');
      }

  
       
       
    
          
  
        
      }



      const measureSave =  (param,title) => {

        param['company'] = getCookie('company_uid');
        param['user'] = getCookie('my-cookie');
  
      
        let measure_data = table_modal_data['measure'].getData();
  
  
        if(measure_data.length > 0){
          for(let i=0; i<measure_data.length; i++){
             
            if(measure_data[i]['item']['type_code'] === '원료'){
              if(parseFloat(measure_data[i]['measure_qty']) === 0 || parseFloat(measure_data[i]['measure_qty']) === null || parseFloat(measure_data[i]['measure_qty']) === undefined){
                return window.alert('계량이 안된 원료가 있습니다.');
              }
            }  
          }

          const url = `${api}/work_task/measure_update`
  
    
          try {
            
            let params = {
              uid : param.uid,
              company_uid : parseInt(param['company']),
              user_id : param['user'],
              
              stock_approval : measure_data,
              unit : param['unit'],
              status : param['status'],
              measure_order : 2, // 자재 출고 승인처리함
              prodution_order : parseInt(param['production_order']),
              packing_order : parseInt(param['packing_order']),
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
              work_task_modal_state.update(() => update_modal);
              update_form = init_form_data;
              work_task_form_state.update(()=> update_form);
              select_query('work_task');
              return common_toast_state.update(() => toast);
    
            }else{
            
              return common_toast_state.update(() => TOAST_SAMPLE['fail']);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
  
      
  
  
        }else{
          return window.alert('출고할 품목이 없습니다.');
        }
  
    
         
         
      
            
    
          
        }
        
      const productSave =  (param,title) => {

        param['company'] = getCookie('company_uid');
        param['user'] = getCookie('my-cookie');
  
      
        let production_data = table_modal_data['work_task_product'].getData();
  
  
        if(production_data.length > 0){
          for(let i=0; i<production_data.length; i++){
             
           
            if(parseFloat(production_data[i]['product_qty']) === 0 || parseFloat(production_data[i]['product_qty']) === null || parseFloat(production_data[i]['product_qty']) === undefined){
                return window.alert('제조수량이 0개인 LOT가 있습니다.');
              }else{
                production_data[i]['product_qty'] = parseFloat(production_data[i]['product_qty']);
              }
            
          }

          const url = `${api}/work_task/production_update`
  
    
          try {
            
            let params = {
              uid : param.uid,
              company_uid : parseInt(param['company']),
              user_id : param['user'],
              
              work_task_product : production_data,
              unit : param['unit'],
              status : param['status'],
           
              production_order : 2, // 제조완료처리함
              packing_order : parseInt(param['packing_order']),
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
              work_task_modal_state.update(() => update_modal);
              update_form = init_form_data;
              work_task_form_state.update(()=> update_form);
              select_query('work_task');
              return common_toast_state.update(() => toast);
    
            }else{
            
              return common_toast_state.update(() => TOAST_SAMPLE['fail']);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
  
      
  
  
        }else{
          return window.alert('출고할 품목이 없습니다.');
        }
  

       
  
    

        }

        const packingSave = () => {
          param['company'] = getCookie('company_uid');
          param['user'] = getCookie('my-cookie');
    
        
          let packing_data = table_modal_data['work_task_packing'].getData();
          
          let box_packing_data = [];
    
          if(packing_data_data.length > 0){
            for(let i=0; i<packing_data.length; i++){
               
             
              if(parseInt(production_data[i]['box_qty']) === 0 || parseInt(packing_data[i]['box_qty']) === null || parseInt(production_data[i]['box_qty']) === undefined){
                  return window.alert('박스갯수를 설정해주십시오.');
                }else if(parseInt(production_data[i]['inbox_qty']) === 0 || parseInt(packing_data[i]['in_box_qty']) === null || parseInt(production_data[i]['in_box_qty'])){
                  return window.alert('구성수량을 설정해주십시오.');
                }
                else{

                  let newItem = { ...packing_data[i] };

                  let total_qty = parseInt(newItem['product_qty']); // 총생산량 (낱개 갯수임)
                  
                  let total_box_qty = 0;
               



        

                
                }
              
            }
  
            const url = `${api}/work_task/production_update`
    
      
            try {
              
              let params = {
                uid : param.uid,
                company_uid : parseInt(param['company']),
                user_id : param['user'],
                
                work_task_product : production_data,
                unit : param['unit'],
                status : param['status'],
             
                production_order : 2, // 제조완료처리함
                packing_order : parseInt(param['packing_order']),
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
                work_task_modal_state.update(() => update_modal);
                update_form = init_form_data;
                work_task_form_state.update(()=> update_form);
                select_query('work_task');
                return common_toast_state.update(() => toast);
      
              }else{
              
                return common_toast_state.update(() => TOAST_SAMPLE['fail']);
              }
            })
            }catch (e:any){
              return console.log('에러 : ',e);
            };
    
        
    
    
          }else{
            return window.alert('출고할 품목이 없습니다.');
          }

        }


  const factoryChange = (key) => {
    let data = factory_sub_data.filter((item) => {
      return item['factory']['uid'] === key;
    })
   
    factory_sub_filter_data = data;
    common_factory_sub_filter_state.update(()=> factory_sub_filter_data);
    if(data.length > 0){
      update_form['factory_sub'] = data[0]['uid'];
    }else{
      update_form['factory_sub'] = "";
    }
   

    
   }

  const barcodeScan = async(data) => {
    console.log('data : ', data);
    // app.html에 CDN 명시해놨음 -> 키보드자판이 한글로 되있을 경우 바코드 영문이 한글로 읽어지는 것을 방지하기위해서임
    let inko = new Inko();
    let barcode = inko.ko2en(data);
    console.log('barcode',barcode);
    if(barcode !== ''){
     
      if(update_form['factory'] ==='' || update_form['factory_sub'] === ''){
        window.alert('공장또는 창고를 입력해주세요.');
      }else{
        let company = getCookie('company_uid');


        const url = `${api}/stock/lot_select`
        let params = 
        {
          lot : barcode,
          company_uid : company,
          factory_uid : update_form['factory'],
          factory_sub_uid : update_form['factory_sub']
  
        };
        const config = {
          params : params,
          headers:{
            "Content-Type": "application/json",
            
          }
        }
        
        await axios.get(url,config).then(res=>{

          let check_data = res.data;
          console.log('check_data : ', check_data);
          if(check_data.length > 0){
            console.log('check_data : ', check_data);

            let stock_request_data = table_modal_data['stock_request'].getData();

            let stock_approval_data = table_modal_data['stock_approval'].getData();

            for(let i=0; i<check_data.length; i++){
              let itemCheck = stock_request_data.find(item => item['item']['uid'] === check_data[i]['item']['uid']);

              if(itemCheck){
                console.log('check_data[i]', check_data[i]);
                let newItem = { ...check_data[i] };
                
                let item_array = stock_request_data.filter((item)=> {
                  return item['item']['uid'] === newItem['item']['uid'];
                })
                
                newItem['item_uid'] = newItem['item']['uid'];
                newItem['factory_uid'] = newItem['factory']['uid'];
                newItem['factory_sub_uid'] = newItem['factorySub']['uid'];
                
                newItem['prev_qty'] = newItem['qty']; // 현재고
                newItem['out_qty'] = parseFloat(item_array[0]['req_qty']); // 불출수량
              
                if(newItem['prev_qty'] < newItem['out_qty']){
                  window.alert('출고수량보다 현재고 보유량이 더 적습니다. 출고수량을 확인해서 수정바랍니다.');

                }

                stock_approval_data.push(newItem);
                 
                
              }else{
                window.alert('출고요청에 없는 품목입니다.');
              }
            }
              
              table_modal_data['stock_approval'].setData(stock_approval_data);
              table_modal_state.update(()=> table_modal_data);
              update_form['barcode_scan'] = '';

            work_task_form_state.update(()=> update_form);
          
          }else{
            window.alert('재고에 없는 데이터입니다.');
            update_form['barcode_scan'] = '';

            work_task_form_state.update(()=> update_form);

          }
         


        });

      }

     




    }else{
      window.alert('바코드를 스캔해주세요.');
    }
   


    
   
 
  }

  const stockRequestModalTable = async(table_modal_state,type,tableComponent) => {
      let data ;

        const url = `${api}/stock_request/uid_select`
    
       
        let params = 
        {
          work_task_uid : update_form['uid'],
  
        };
        const config = {
          params : params,
          headers:{
            "Content-Type": "application/json",
            
          }
        }
        if(table_modal_state[type]){
          table_modal_state[type].destory();
        }
  
          await axios.get(url,config).then(res=>{
              
         
           data =  res.data;
          
           console.log('data : ', data);
          });
  
        table_modal_data[type] =   new Tabulator(tableComponent, {
        
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
          rowHeight:40, //set rows to 40px height
          // selectable: true,
        rowClick:function(e, row){
          //e - the click event object
          //row - row component
  
       
          row.toggleSelect(); //toggle row selected state on row click
      },
  
        rowFormatter:function(row){
              row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     
  
        data : data,
        placeholder:"데이터 없음",
        columns: MODAL_TABLE_HEADER_CONFIG[type],
        
        });
  
        update_form['modal'] = true;

        work_task_form_state.update(()=> update_form);      
        table_modal_state.update(()=> table_modal_data);
    
  }


  const stockApprovalModalTable = async(table_modal_state,type,tableComponent) => {
 
      if(table_modal_state[type]){
        table_modal_state[type].destory();
      }

  
      table_modal_data[type] =   new Tabulator(tableComponent, {
      
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
        rowHeight:40, //set rows to 40px height
        // selectable: true,
      rowClick:function(e, row){
        //e - the click event object
        //row - row component

     
        row.toggleSelect(); //toggle row selected state on row click
    },

      rowFormatter:function(row){
            row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
      },
   

      data : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });

      update_form['modal'] = true;

      work_task_form_state.update(()=> update_form);      
      table_modal_state.update(()=> table_modal_data);
  
}

const measureModalTable = async(table_modal_state,type,tableComponent) => {
  let data ;

    const url = `${api}/stock_approval/uid_select`

   
    let params = 
    {
      work_task_uid : update_form['uid'],

    };
    const config = {
      params : params,
      headers:{
        "Content-Type": "application/json",
        
      }
    }
    if(table_modal_state[type]){
      table_modal_state[type].destory();
    }

      await axios.get(url,config).then(res=>{
          
     
       data =  res.data;
      
       console.log('data : ', data);
      });

    table_modal_data[type] =   new Tabulator(tableComponent, {
    
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
      rowHeight:40, //set rows to 40px height
      // selectable: true,
    rowClick:function(e, row){
      //e - the click event object
      //row - row component

   
      row.toggleSelect(); //toggle row selected state on row click
  },

    rowFormatter:function(row){
          row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
    },
 

    data : data,
    placeholder:"데이터 없음",
    columns: MODAL_TABLE_HEADER_CONFIG[type],
    
    });

    update_form['modal'] = true;

    work_task_form_state.update(()=> update_form);      
    table_modal_state.update(()=> table_modal_data);

}


const workTaskProductModalTable = async(table_modal_state,type,tableComponent) => {
 
  if(table_modal_state[type]){
    table_modal_state[type].destory();
  }


  table_modal_data[type] =   new Tabulator(tableComponent, {
  
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
    rowHeight:40, //set rows to 40px height
    // selectable: true,
  rowClick:function(e, row){
    //e - the click event object
    //row - row component

 
    row.toggleSelect(); //toggle row selected state on row click
},

  rowFormatter:function(row){
        row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
  },


  data : [],
  placeholder:"데이터 없음",
  columns: MODAL_TABLE_HEADER_CONFIG[type],
  
  });

  update_form['modal'] = true;

  work_task_form_state.update(()=> update_form);      
  table_modal_state.update(()=> table_modal_data);

}


const workTaskPackingModalTable = async(table_modal_state,type,tableComponent) => {
  let data = [] ;

    const url = `${api}/work_task_product/uid_select`

   
    let params = 
    {
      work_task_uid : update_form['uid'],

    };
    const config = {
      params : params,
      headers:{
        "Content-Type": "application/json",
        
      }
    }
    if(table_modal_state[type]){
      table_modal_state[type].destory();
    }

      await axios.get(url,config).then(res=>{
          
     
       data =  res.data;

       if(data.length > 0){
        for(let i= 0; i<data.length; i++){
          data[i]['bom_code'] = data[i]['bom']['code'];
          data[i]['bom_uid'] = data[i]['bom']['uid'];
          
        }

       }
      
      
      });

    table_modal_data[type] =   new Tabulator(tableComponent, {
    
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
      rowHeight:40, //set rows to 40px height
      // selectable: true,
    rowClick:function(e, row){
      //e - the click event object
      //row - row component

   
      row.toggleSelect(); //toggle row selected state on row click
  },

    rowFormatter:function(row){
          row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
    },
 

    data : data,
    placeholder:"데이터 없음",
    columns: MODAL_TABLE_HEADER_CONFIG[type],
    
    });

    update_form['modal'] = true;

    work_task_form_state.update(()=> update_form);      
    table_modal_state.update(()=> table_modal_data);

}










  


 



 
  const workPlanSearchModalOpen = (title : any, data:any) => {

    alert['type'] = 'save';
    alert['value'] = false;
    common_alert_state.update(() => alert);
    work_plan_modal['title'] = title;
    work_plan_modal[title]['use'] = true;
    work_plan_modal[title]['title'] = title;
    work_plan_modal_state.update(() => work_plan_modal);
    

  
  }
   


const workPlanSearchModalClose = (title) => {
  work_plan_modal['title'] = '';
  work_plan_modal[title]['use'] = !work_plan_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  work_plan_modal_state.update(() => work_plan_modal);
 
}

const workPlanSearchTable = (table_state,type,tableComponent,select,title) => {


 const url = `${api}/${type}/${select}`; 

 const config = {
 
   headers:{
     "Content-Type": "application/json",
     
   }
 }
   axios.get(url,config).then(res=>{
     if(table_modal_state['work_plan']){
       table_modal_state['work_plan'].destory();
     }

     if(res.data.length > 0){
     let data = res.data;
 
           table_modal_data['work_plan'] =   new Tabulator(tableComponent, {
             height:TABLE_TOTAL_CONFIG['height'],
             layout:TABLE_TOTAL_CONFIG['layout'],
             pagination:TABLE_TOTAL_CONFIG['pagination'],
             paginationSize:1000,
             paginationSizeSelector:[10, 50, 100,1000,5000],
             movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
             paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
             paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
             locale: TABLE_TOTAL_CONFIG['locale'],
             langs: TABLE_TOTAL_CONFIG['langs'],
             selectable: true,
             rowClick:function(e, row){
             
               row.toggleSelect(); //toggle row selected state on row click,
           },
   
             rowFormatter:function(row){
                   row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
                   let selected = row.getData().selected;

                   if(selected){
                     console.log('selected : ', selected);
                     row.getElement().classList.add("tabulator-selected");
                     row.toggleSelect();
                     console.log('selected : ', row.getData());
                   }
             },
          
          
   
             data :  data,
 
             columns: MODAL_TABLE_HEADER_CONFIG['work_task_work_plan_search'],
             
        
            
             });
             table_modal_state.update(()=> table_modal_data);
          
   }
 })
       
}

const workPlanSelect = (row) => {
  
  console.log('row : ', row);

  update_form['bom'] = row.bom.uid;
  update_form['bom_code'] = row.bom.code;
  update_form['work_plan'] = row.uid;
  update_form['work_plan_code'] = row.code;
  update_form['work_start_date'] = row.startDate;
  update_form['work_end_date'] = row.endDate;
  update_form['task_qty'] = parseFloat(row.qty);
  update_form['unit'] = row.unit;
  
  
  

  work_plan_modal['work_task_work_plan_search']['use'] = !work_plan_modal['work_task_work_plan_search']['use'];


  work_task_form_state.update(()=> update_form);
  work_plan_modal_state.update(()=> work_plan_modal);
  
}

const workTaskProductAddRow = (e) => {
 
  let company_uid = getCookie('company_uid');  
  let data = table_modal_data['work_task_product'].getData();
  
  console.log('update_form : ', update_form);
  let new_obj = {
    uid : parseInt(data.length) + 1, 
    company_uid : company_uid,
    
    bom_uid :  update_form['bom'],
    bom_code : update_form['bom_code'],
    work_task_uid : update_form['uid'],
    lot : update_form['bom_code'] + moment().format('YYYYMMDD') + parseInt(data.length),
    status : '합격',
    product_qty : 0, 
    unit : '',
  }

  data.push(new_obj);

  table_modal_data['work_task_product'].setData(data);
  table_modal_state.update(()=> table_modal_data);
  
}




const workTaskProductDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['work_task_product'].getData();
  
  data.pop();
  table_modal_data['work_task_product'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const workTaskProductAllDeleteRow = () => {
 

  table_modal_data['work_task_product'].setData([]);

  table_modal_state.update(()=> table_modal_data);

}


const workTaskProductSelectDelete = (row) => {



   let new_data = row.getData();
   let filterd_data;
   
    filterd_data = table_modal_data['work_task_product'].getData().filter((item) => {
       return item.uid !== new_data.uid;
     })
    
     table_modal_data['work_task_product'].setData(filterd_data);
     table_modal_state.update(()=> table_modal_data);

     
 }





export {  workTaskModalOpen,save,modalClose,workPlanSearchTable,workPlanSearchModalClose,makeCustomTable,workPlanSelect,workPlanSearchModalOpen,stockRequestModalTable,barcodeScan,factoryChange,stockApprovalModalTable,cancelSave,approvalSave,measureModalTable,measureSave, productSave,workTaskProductModalTable,workTaskProductAddRow,workTaskProductDeleteRow,workTaskProductAllDeleteRow,workTaskProductSelectDelete,packingSave,workTaskPackingModalTable}