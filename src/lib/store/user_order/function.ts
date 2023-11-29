

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;
let user_data : any;
let selected_data : any;


let init_form_data = {
  uid : 0,
  id : '',
  code : '',
  customer_name : '',
  name : '',
  email : '',
  phone : '',
  password : '1111',
  car : '',
  used : 1,

}


user_order_modal_state.subscribe((data) => {
    update_modal = data;
})

user_order_form_state.subscribe((data) => {
    update_form = data;
})


common_alert_state.subscribe((data) => {
  alert = data;
})
common_toast_state.subscribe((data) => {
  toast = data;
})

common_search_state.subscribe((data) => {
  search_state = data;
})

login_state.subscribe((data) => {
  login_data = data;
})
table_state.subscribe((data) => {
  table_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

common_user_state.subscribe((data) => {
  user_data = data;
})
 
 



const userOrderModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    user_order_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      user_order_form_state.update(() => init_form_data);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
            if(item === 'car' || item === 'user'){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            user_order_form_state.update(() => update_form);
            user_order_modal_state.update(() => update_modal);
            console.log('update_modal : ', update_modal);

    }
    if(title === 'check_delete'){
      let data =  table_data['user'].getSelectedData();

      common_selected_state.update(() => data);
      
      console.log('modalOpen : ', data);
      let uid_array = [];
      if(data.length === 0){
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
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
      console.log('table_state : ', table_state['user_order']);
      table_data[type].setData(res.data);
      table_state.update(() => table_data);
      console.log('table_data : ', table_data);
   })

}

const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
      console.log('param : ', param);
      let data = table_data['user_order_sub'].getSelectedData();

      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })

      return console.log('checked_data : ', checked_data);

      if( param['user'] === '' || param['car'] === '' || checked_data.length === 0 || checked_data.length === undefined ){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        user_order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/user/save`
        try {
  
          
          let params = {
            
            order_status : param.order_status,
            price_status : param.price_status,
            user_id : param.user,
            car_uid : param.car,
            used : param.used,
            auth : 'user',
            user_order_sub : checked_data,
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
            user_order_modal_state.update(() => update_modal);

            

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
      const url = `${api}/user/update`
      
      
      let data =  table_data['user_order_sub'].getSelectedData();

      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })

     
     
      try {

        console.log('params : ', param);
        let params = {
          id : param.id,
          code : param.code,
          name : param.name,
          password : param.password,
          customer_name : param.customer_name,
          email : param.email,
          phone : param.phone,
          
          car_uid : param.car,
          used : param.used,
          auth : 'user',
          token : login_data['token'],
          user_order_sub : checked_data,

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
          user_order_modal_state.update(() => update_modal);
          user_order_form_state.update(()=> init_form_data);
          select_query('user');
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
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['id']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/user/delete`
          try {
    
            let params = {
              id : uid_array,
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
              user_order_modal_state.update(() => update_modal);
              user_order_form_state.update(()=> init_form_data);

              select_query('user');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              return common_toast_state.update(() => TOAST_SAMPLE['fail']);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    
        }

        update_modal[title]['use'] = !update_modal[title]['use'];
        user_order_modal_state.update(() => update_modal);
        user_order_form_state.update(()=> init_form_data);
    }
  }


  const userOrderSubTable = (table_state,type,tableComponent) => {


    const url = `${api}/product/select`; 

  
    let start_date = moment().subtract(10, "year").format('YYYY-MM-DDTHH:mm:ss');

    let end_date = moment().add(1, "day").format('YYYY-MM-DDTHH:mm:ss');

    let search_text = '';
    let filter_title = 'all';
    let checked_data = [];
  

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
        if(table_state['user_order_sub']){
          table_state['user_order_sub'].destory();
        }

        if(res.data.length > 0){
          let product_data = res.data;
    
          const url = `${api}/user_product/info_select`;
           
  
          let params = 
          {
          user_id : update_form.user
          };
          const config = {
            params : params,
            headers:{
              "Content-Type": "application/json",
              
            }
          }
            axios.get(url,config).then(res=>{
              
              let user_order_checked_data =  res.data;
          

              for(let i=0; i < product_data.length; i++){
                let product_uid = product_data[i]['uid'];

                for(let j=0; j< user_order_checked_data.length; j++){
                  let user_order_checked_uid = user_order_checked_data[j]['product']['uid'];
                  if(product_uid === user_order_checked_uid){
                    checked_data.push(product_uid);
                    product_data[i]['selected'] = true; 
                    
                    product_data[i]['qty'] = user_order_checked_data[j]['qty'].toString(); 
                    
                    console.log(user_order_checked_data[j]['qty']);
                    user_order_checked_data.splice(j,1);
                    break;
                  }

                }


              }

              console.log('product_data',product_data);
            
              // table_data['user_order_sub'].setData(res.data);
              // table_state.update(() => table_data);
              table_data['user_order_sub'] =   new Tabulator(tableComponent, {
                height:"40vh",
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
                  //e - the click event object
                  //row - row component
               
                  row.toggleSelect(); //toggle row selected state on row click
              },
      
                rowFormatter:function(row){
                      row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
                      let selected = row.getData().selected;

                      if(selected){
                        row.getElement().classList.add("tabulator-selected");
                        row.toggleSelect();
                      }
                },
             
             
      
                data : product_data,
              
                columns: TABLE_HEADER_CONFIG['user_product'],
                
           
               
                });
                table_state.update(()=> table_data);
             
           })
        
         
       
        
    }else{
      
      if(table_state['user_order_sub']){
        table_state['user_order_sub'].destory();
      }

      table_data['user_order_sub'] =   new Tabulator(tableComponent, {
        height:"25vh",
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
      
        columns: TABLE_HEADER_CONFIG['user_product'],
      
  
        });
        console.log('table_data  :', table_data);

        table_state.update(()=> table_data);


    }
     })

    
}




const userTable = (table_state,type,tableComponent) => {

            table_data[type] =   new Tabulator(tableComponent, {
              height:"25vh",
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
             
    

           
              data : user_data, 
              columns: [
                {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
                cellClick:function(e : any, cell:any){
                    console.log('cellClick',cellClick);
                    cell.getRow().toggleSelect();
                    
                }},
                {title:"ID", field:"id", width:150, headerFilter:"input"},
                {title:"사업자번호", field:"code", width:150, headerFilter:"input",
                formatter:function(cell : any){
                    var value = cell.getValue();
                return businessNumber(value);
                 },
                },
                {title:"상호명", field:"customer_name", width:150, headerFilter:"input", 
                formatter:function(cell : any){
                    var value = cell.getValue();
                    
                return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
                 },
        
                cellClick:function(e : any, cell:any){
               
                    let row = cell.getRow();
                   if(row){
                    console.log('row : ', row.getData());
                    let id = row.getData().id;
                    let car = row.getData().car['uid'];
                    
                    update_form['user'] = id;
                    update_form['car'] = car;
                    
                    user_order_form_state.update(() => update_form);
                
                   }else{
                  
                   }
                }


                },
                {title:"지정차량", field:"car.name", width:150, headerFilter:"input"},
                {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
                    var value = cell.getValue();
                return phoneNumber(value);
                 },},
          
                {title:"이메일", field:"email", width:150, headerFilter:"input"},
                
                {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
                formatter: function(cell : any, formatterParams: any, onRendered: any) {
                    // Luxon을 사용하여 datetime 값을 date로 변환
                    const datetimeValue = cell.getValue();
                    const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
                    return date;
                }},     
            
           ],
           rowClick:function(e, row){
            //e - the click event object
            //row - row component
            console.log('test : ', row);
            row.toggleSelect(); //toggle row selected state on row click
        },

              });
              table_state.update(()=> table_data);
        
}


export {userOrderModalOpen,save,userTable,userOrderSubTable}