

//@ts-nocheck

import { writable } from 'svelte/store';
import {work_plan_modal_state,work_plan_form_state} from './state';
import {bom_modal_state} from '$lib/store/bom/state';

import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,production_work_plan_state} from '$lib/store/common/state';
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
let work_plan_data : any;
let work_plan_upload_data : any;
let work_plan_sub_upload_data : any;
let restric_material_data;

let selected_data : any;
let search_data : any;
let bom_modal : any;

let company_modal : any;

let estimate_modal : any;


let init_form_data:any = {
  uid : 0,
  company : '', // 사업장
  user : '',
  bom_code : '',
  bom : '', // BOM
  qty : 1,
  unit : "G",
  start_date : moment().format('YYYY-MM-DD'),
  end_date : moment().format('YYYY-MM-DD'),
  
  used : 1,

}

let init_work_plan_uid :any ;

work_plan_modal_state.subscribe((data) => {
    update_modal = data;
})

work_plan_form_state.subscribe((data) => {
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
production_work_plan_state.subscribe((data) => {
  work_plan_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

bom_modal_state.subscribe((data) => {
  bom_modal = data;
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


const workPlanModalOpen = (data : any, title : any) => {

    if(title === 'add'){
       
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_plan_modal_state.update(() => update_modal);
   
      update_form = {
        uid : 0,
        company : '', // 사업장
        user : '',
        bom_code : '',
        bom : '', // BOM
        qty : 1,
        unit : "G",
        start_date : moment().format('YYYY-MM-DD'),
        end_date : moment().format('YYYY-MM-DD'),
        
        used : 1,
      };

      work_plan_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    work_plan_modal_state.update(() => update_modal);

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'user' ){
              update_form[item] = data[item]['uid'];
             
        
            }else if(item === 'bom'){
              update_form[item] = data[item]['uid'];
              update_form['bom_code'] = data[item]['code'];
              
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 

            work_plan_form_state.update(() => update_form);
            work_plan_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      alert['type'] = 'check_delete';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      work_plan_modal_state.update(() => update_modal);



      let data =  table_list_data['work_plan'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['work_plan']);
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

  if(table_modal_data['work_plan_sub']){
    table_modal_data['work_plan_sub'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  work_plan_modal_state.update(() => update_modal);
  work_plan_form_state.update(() => update_form);
  
}



const save =  (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid');
  param['user'] = getCookie('my-cookie');
  

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if( param['bom'] === '' ||  param['company'] === ''  || param['user'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        work_plan_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
  

        const url = `${api}/work_plan/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            bom_uid : param['bom'],
            user_id : param['user'],
            qty : parseFloat(param['qty']),
            unit : param['unit'],
            startDate : param['start_date'],
            endDate : param['end_date'],
          
            used : param.used,
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
            
            work_plan_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
            company : '', // 사업장
            user : '',
            bom : '', // BOM
            bom_code : '',
            qty : 1,
            unit : "G",
            start_date : moment().format('YYYY-MM-DD'),
            end_date : moment().format('YYYY-MM-DD'),
            
            used : 1,
            };
           
            work_plan_form_state.update(()=> update_form);


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

      if( param['bom'] === '' ||  param['company'] === ''  || param['user'] === ''){
      
        alert['type'] = 'save';
        alert['value'] = true;
        work_plan_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
   
        const url = `${api}/work_plan/update`

       
      
      
        try {
  
        
          let params = {
            uid : param.uid,
            company_uid : parseInt(param['company']),
            bom_uid : param['bom'],
            user_id : param['user'],
            qty : parseFloat(param['qty']),
            unit : param['unit'],
            startDate : param['start_date'],
            endDate : param['end_date'],
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
            work_plan_modal_state.update(() => update_modal);
            update_form = init_form_data;
            work_plan_form_state.update(()=> update_form);
            select_query('work_plan');
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

          const url = `${api}/work_plan/delete`
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
              work_plan_modal_state.update(() => update_modal);
              work_plan_form_state.update(()=>update_form);

              select_query('work_plan');
    
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


 



 
  const bomSearchModalOpen = (title : any, data:any) => {


  
  
    alert['type'] = 'save';
    alert['value'] = false;

    common_alert_state.update(() => alert);
    bom_modal['title'] = title;
    bom_modal[title]['use'] = true;
    bom_modal[title]['title'] = title;
  
    
  
    bom_modal_state.update(() => bom_modal);
  
  }
   


const bomSearchModalClose = (title) => {
  bom_modal['title'] = '';
  bom_modal[title]['use'] = !bom_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  bom_modal_state.update(() => bom_modal);
 
}

const bomSearchTable = (table_state,type,tableComponent,select,title) => {


 const url = `${api}/${type}/${select}`; 

 const config = {
 
   headers:{
     "Content-Type": "application/json",
     
   }
 }
   axios.get(url,config).then(res=>{
     if(table_modal_state['bom']){
       table_modal_state['bom'].destory();
     }

     if(res.data.length > 0){
     let data = res.data;
 
           table_modal_data['bom'] =   new Tabulator(tableComponent, {
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
 
             columns: MODAL_TABLE_HEADER_CONFIG['work_plan_bom_search'],
             
        
            
             });
             table_modal_state.update(()=> table_modal_data);
          
   }
 })
       
}

const bomSelect = (row) => {
  

  update_form['bom'] = row.uid;
  update_form['bom_code'] = row.code;
  
  
  bom_modal['work_plan_bom_search']['use'] = !bom_modal['work_plan_bom_search']['use'];

  bom_modal_state.update(() => bom_modal);
  work_plan_form_state.update(()=> update_form);
  
}




export {  workPlanModalOpen,save,modalClose,bomSearchTable,bomSearchModalClose,makeCustomTable,bomSelect,bomSearchModalOpen}