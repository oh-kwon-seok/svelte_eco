

//@ts-nocheck

import { writable } from 'svelte/store';
import {stock_inout_modal_state,stock_inout_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';
import {stock_modal_state} from '$lib/store/stock/state';
import {estimate_modal_state} from '$lib/store/estimate/state';
import {company_modal_state} from '$lib/store/company/state';
import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,stock_stock_inout_state, common_factory_sub_filter_state, common_factory_sub_state} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE,CLIENT_INFO} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';


import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/stock/constants';
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
let stock_inout_data : any;
let stock_inout_upload_data : any;
let stock_inout_sub_upload_data : any;
let restric_material_data;

let selected_data : any;
let search_data : any;
let item_modal : any;
let stock_modal : any;

let company_modal : any;

let estimate_modal : any;

let factory_data : any;

let factory_sub_data : any;
let factory_sub_filter_data : any ;



let init_form_data:any = {
  uid : 0,
  modal: false,
  user : '',
  company : '',
  doc_type : '입고',
  status : '입고',
  stock_inout_sub_array : [],
 

}

let init_stock_inout_uid :any ;

stock_inout_modal_state.subscribe((data) => {
    update_modal = data;
})

stock_inout_form_state.subscribe((data) => {
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
stock_stock_inout_state.subscribe((data) => {
  stock_inout_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

item_modal_state.subscribe((data) => {
  item_modal = data;
})

stock_modal_state.subscribe((data) => {
  stock_modal = data;
})
company_modal_state.subscribe((data) => {
  company_modal = data;
})
estimate_modal_state.subscribe((data) => {
  estimate_modal = data;
})

common_factory_sub_state.subscribe((data) => {
  factory_sub_data = data;
})

common_factory_sub_filter_state.subscribe((data) => {
  factory_sub_filter_data = data;
})
 


 
const stockInoutSubModalTable = async(table_modal_state,type,tableComponent,select,title) => {

  
  
  if(title === 'add'){
    
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

         
         stock_inout_form_state.update(()=> update_form);

         table_modal_state.update(()=> table_modal_data);
        
          
    }else if(title === 'update'){
      const url = `${api}/stock_inout_sub/uid_select`

     
      let params = 
      {
        stock_inout_uid : update_form['uid'],

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
            
          let data =  res.data;
          console.log('data : ', data);
          if(data.length > 0){
            for(let i =0; i<data.length; i++){
              data[i]['item_uid'] = data[i]['item']['uid'];
          
            }

          }


          update_form['stock_inout_sub_array'] = data;
          
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
        rowHeight:100, //set rows to 40px height
        // selectable: true,
      rowClick:function(e, row){
        //e - the click event object
        //row - row component

     
        row.toggleSelect(); //toggle row selected state on row click
    },

      rowFormatter:function(row){
            row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
      },
   

      data : update_form['stock_inout_sub_array'].length > 0 ? update_form['stock_inout_sub_array'] : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });

      update_form['modal'] = true;

         
      stock_inout_form_state.update(()=> update_form);
    
      table_modal_state.update(()=> table_modal_data);
  
   

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

const factoryChange = (key) => {
  let data = factory_sub_data.filter((item) => {
    return item['factory']['uid'] === key;
  })
  console.log('filter_data : ', data);
  factory_sub_filter_data = data;
  common_factory_sub_filter_state.update(()=> factory_sub_filter_data);
  if(data.length > 0){
    update_form['factory_sub'] = data[0]['uid'];
    update_form['factory_name'] = data[0]['factory']['name'];
    update_form['factory_sub_name'] = data[0]['name'];
  
    console.log('update_form : ',update_form);

    stock_inout_form_state.update(() => update_form);
    
  
  }
 }

 const factorySubChange = (key) => {
  
 
  if(data.length > 0){
    update_form['factory_sub'] = key;
    update_form['factory_name'] = data[0]['factory']['name'];
  }
 }




const stockInoutAddRow = (e) => {
 

  if(update_form['factory'] === undefined || update_form['factory'] === "" || update_form['factory'] === null ){
    return window.alert('공장을 선택해주세요.');
  }else if(update_form['factory_sub'] === undefined || update_form['factory_sub'] === "" || update_form['factory_sub'] === null ){
    return window.alert('창고를 선택해주세요.');
  }
 


  let company_uid = getCookie('company_uid');


  
  let data = table_modal_data['stock_inout_sub'].getData();


  
  let new_obj = {
    uid : parseInt(data.length) + 1, 
    company_uid : company_uid,
    item : { ingr_eng_name : ""},
    item_uid : 0,
    factory : update_form['factory'],
    factory_name : update_form['factory_name'],
    factory_sub : update_form['factory_sub'],
    factory_sub_name : update_form['factory_sub_name'],
    
    lot : "",
    qty : 0,
    unit : '',

  }


  update_form['stock_inout_sub_array'].push(new_obj);
  
  stock_inout_form_state.update(()=> update_form);

  data.push(new_obj);

  console.log('data : ', data);
  table_modal_data['stock_inout_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);
  
}




const stockInoutDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['stock_inout_sub'].getData();
  
  data.pop();
  table_modal_data['stock_inout_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const stockInoutAllDeleteRow = () => {
 

  table_modal_data['stock_inout_sub'].setData([]);

  table_modal_state.update(()=> table_modal_data);

}



const stockInoutModalOpen = (data : any, title : any) => {

    if(title === 'add'){
       
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    stock_inout_modal_state.update(() => update_modal);
   
      update_form = {
        uid : 0,
        modal: false,
        user : '',
        company : '',
        factory : '',
        factory_name : '',
        factory_sub : '',
        factory_sub_name : '',
        doc_type : '입고',
      status : '입고',
        stock_inout_sub_array : [],
      };


      console.log('update_form : ', update_form);
      stock_inout_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    stock_inout_modal_state.update(() => update_modal);

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
            
            }else if(item === 'user'){
              update_form[item] = data[item]['id'];

            } else{
              update_form[item] = data[item];
  
            }
           
        }); 

        update_form['modal'] = false;

        console.log('update_form : ', update_form);
            stock_inout_form_state.update(() => update_form);
            stock_inout_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      alert['type'] = 'check_delete';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      stock_inout_modal_state.update(() => update_modal);



      let data =  table_list_data['stock_inout'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['stock_inout']);
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

  if(table_modal_data['stock_inout_sub']){
    table_modal_data['stock_inout_sub'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  stock_inout_modal_state.update(() => update_modal);
  stock_inout_form_state.update(() => update_form);
  
}



const stockInoutSubSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
     filterd_data = table_modal_data['stock_inout_sub'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['stock_inout_sub'].setData(filterd_data);
      table_modal_state.update(()=> table_modal_data);

      }
  }




const save =  (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid');
  param['user'] = getCookie('my-cookie');
  

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if(param['company'] === ''  ||  param['user'] === '' ){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        stock_inout_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['stock_inout_sub'].getData();
      
        const url = `${api}/stock_inout/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            user_id : param['user'],
            doc_type : param['doc_type'],
            status : param['status'],
            stock_inout_sub : data,
          
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
            
            stock_inout_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
            modal: false,
            user : '',
            company : '',
            doc_type : '입고',
            status : '입고',
        
          
            stock_inout_sub_array : [],
            };
           
            stock_inout_form_state.update(()=> update_form);


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

      if( param['code'] === '' ||  param['company'] === ''  || param['customer'] === '' || param['name'] === '' || param['user'] === '' || param['estimate'] === ''){
      
        alert['type'] = 'save';
        alert['value'] = true;
        stock_inout_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['stock_inout_sub'].getData();
        const url = `${api}/stock_inout/update`
        
        if(data.length > 0){
          for(let i=0; i<data.length; i++){
            if(data[i]['item_uid'] === 0 || data[i]['item_uid'] === null || data[i]['item_uid'] === undefined){
              
              alert['type'] = 'save';
              alert['value'] = true;
              // stock_inout_modal_state.update(() => update_modal);
              common_alert_state.update(() => alert)
              
              return window.alert(`${i+1}번째 열의 품목정보가 비었습니다.`);

            }

          }

        }
       
      
      
        try {
  
        
          let params = {
            uid : param.uid,
            company_uid : parseInt(param['company']),
            customer_uid : parseInt(param['customer']),
            estimate_uid : parseInt(param['estimate']),
            code : param['code'],
            user_id : param['user'],
            name  : param['name'],
            product_spec : param['product_spec'],
            ship_place : param['ship_place'],
            description : param['description'],
            ship_date : param['ship_date'],
           
            stock_inout_sub : data,
            used : param.used,
            token : login_data['token'],
            
          };
  
          console.log('params : ', params);
  
         
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
            stock_inout_modal_state.update(() => update_modal);
            update_form = init_form_data;
            stock_inout_form_state.update(()=> update_form);
            select_query('stock_inout');
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

          const url = `${api}/stock_inout/delete`
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
              stock_inout_modal_state.update(() => update_modal);
              stock_inout_form_state.update(()=>update_form);

              select_query('stock_inout');
    
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



const stockInoutSubItemSearchModalOpen = (title : any, data:any) => {

  console.log('data : ', data);
  init_stock_inout_uid = data.getData();
   
 
  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  
    if(update_form['status'] === '입고'){
      item_modal['title'] = title;
      item_modal[title]['use'] = true;
      item_modal[title]['title'] = title;
      item_modal_state.update(() => item_modal);

    }else if(update_form['status'] === '출고'){
      stock_modal['title'] = title;
      stock_modal[title]['use'] = true;
      stock_modal[title]['title'] = title;
      stock_modal_state.update(() => stock_modal);

    }else{
      return window.alert();
    }

 

 }

 


const itemSearchModalClose = (title) => {
  item_modal['title'] = '';
  item_modal[title]['use'] = !item_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  item_modal_state.update(() => item_modal);
 

}

const itemSearchTable = (table_state,type,tableComponent,select,title) => {


 const url = `${api}/${type}/${select}`; 

 const config = {
 
   headers:{
     "Content-Type": "application/json",
     
   }
 }
   axios.get(url,config).then(res=>{
     if(table_modal_state['item']){
       table_modal_state['item'].destory();
     }

     if(res.data.length > 0){
     let data = res.data;
 

           table_modal_data['item'] =   new Tabulator(tableComponent, {
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
 
             columns: MODAL_TABLE_HEADER_CONFIG['stock_inout_item_search'],
             
        
            
             });
             table_modal_state.update(()=> table_modal_data);
          
   }
 })
       
}

const stockSearchTable = (table_state,type,tableComponent,select,title) => {


  const url = `${api}/${type}/${select}`; 
 
  const config = {
  
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      if(table_modal_state['stock']){
        table_modal_state['stock'].destory();
      }
 
      if(res.data.length > 0){
      let data = res.data;
  
 
            table_modal_data['stock'] =   new Tabulator(tableComponent, {
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
  
              columns: MODAL_TABLE_HEADER_CONFIG['stock_inout_stock_search'],
              
         
             
              });
              table_modal_state.update(()=> table_modal_data);
           
    }
  })
        
 }
 







const stockInoutSubitemSelect = (row) => {
   

  

  let new_data = row.getRow().getData();
  
  
  
  let checkData ; 
  checkData = table_modal_data['stock_inout_sub'].getData().find(item => item['item_uid'] === new_data['uid']);

  if(checkData){
    return window.alert('품목 리스트에 존재하는 품목입니다.');
    

  }else{
   
    init_stock_inout_uid.item_uid = new_data.uid;
    init_stock_inout_uid.item.ingr_kor_name = new_data.ingr_kor_name;
    init_stock_inout_uid.item.ingr_eng_name = new_data.ingr_eng_name;
    
   

    row.getRow().update(init_stock_inout_uid);

    let final_data = table_modal_data['stock_inout_sub'].getData();

    table_modal_data['stock_inout_sub'].setData(final_data)

    table_modal_state.update(()=> table_modal_data);

    item_modal['stock_inout_item_search']['use'] = !item_modal['stock_inout_item_search']['use'];
    item_modal_state.update(() => item_modal);
  
  }
}











export { stockInoutModalOpen,save,modalClose,stockInoutSubModalTable,stockInoutAddRow,stockInoutDeleteRow,stockInoutAllDeleteRow,stockInoutSubSelectDelete,stockInoutSubItemSearchModalOpen,itemSearchTable,stockInoutSubitemSelect,itemSearchModalClose,makeCustomTable,factoryChange,factorySubChange,stockSearchTable}