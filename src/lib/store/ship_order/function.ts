

//@ts-nocheck

import { writable } from 'svelte/store';
import {ship_order_modal_state,ship_order_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';

import {order_modal_state} from '$lib/store/order/state';
import {company_modal_state} from '$lib/store/company/state';
import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,sales_ship_order_state,common_restric_material_state} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE,CLIENT_INFO} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';


import {TABLE_TOTAL_CONFIG,MODAL_TABLE_HEADER_CONFIG,TABLE_FILTER,EXCEL_CONFIG,TABLE_HEADER_CONFIG} from '$lib/module/sales/constants';
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

let selected_data : any;
let search_data : any;


let order_modal : any;


let init_form_data:any = {
  uid : 0,
  modal: false,
  company : '', // 사업장
  customer : '', // 거래처
  order : '', // 주문서
  customer_name : '',
  barcode_scan : '',
  user : '',
  code : '', // 견적코드
  name : '',
  product_spec : "", // 제품 사양
  ship_place : "", // 납품 장소
  description : "", // 발주조건 및 기타 특이사항
  order_ship_date : moment().format('YYYY-MM-DD'), //  계약상 납품일자
  ship_date : moment().format('YYYY-MM-DD'), //  실제납품일자
  order_count : 0, // 납기일자 차이
  ship_order_sub_array : [],
  used : 1,

}

let init_ship_order_uid :any ;

ship_order_modal_state.subscribe((data) => {
    update_modal = data;
})

ship_order_form_state.subscribe((data) => {
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
table_modal_state.subscribe((data) => {
  table_modal_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})


order_modal_state.subscribe((data) => {
  order_modal = data;
})




 
const orderSubModalTable = async(table_modal_state,type,tableComponent,select,title) => {

  
  
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
       
  
          data : [],
          placeholder:"데이터 없음",
          columns: MODAL_TABLE_HEADER_CONFIG[type],
          
          });

         update_form['modal'] = true;

         
         ship_order_form_state.update(()=> update_form);

         table_modal_state.update(()=> table_modal_data);
        
          
    }
    if(title === 'update'){

      const url = `${api}/order_sub/uid_select`
      let data;
         
      let params = 
      {
        order_uid : update_form['order'],
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
  
      ship_order_form_state.update(()=> update_form);      
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




const shipOrderModalOpen = (data : any, title : any) => {


  
 

   
    if(title === 'add'){
       
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    ship_order_modal_state.update(() => update_modal);
   
      update_form = {
        uid : 0,
        modal: false,
        company : '', // 사업장
        customer : '', // 거래처
        order : '', // 주문서
        customer_name : '',
    
        user : '',
        code : '', // 견적코드
        name : '',
        product_spec : "", // 제품 사양
        ship_place : "", // 납품 장소
        description : "", // 발주조건 및 기타 특이사항
        order_ship_date : moment().format('YYYY-MM-DD'), //  계약상 납품일자
        ship_date : moment().format('YYYY-MM-DD'), //  실제납품일자
        order_count : 0, // 납기일자 차이
        ship_order_sub_array : [],
        used : 1,
      };


      console.log('update_form : ', update_form);
      ship_order_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    ship_order_modal_state.update(() => update_modal);

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'customer' || item === 'order' ){
              update_form[item] = data[item]['uid'];
             
            

          
            }else if(item === 'order_ship_date'){
             
              update_form['order_ship_date'] = data['order']['ship_date'];

            }else if(item === 'customer_name'){
              update_form[item] = data['customer']['name']

            }else{
              update_form[item] = data[item];
            
            }
           
        }); 

        update_form['modal'] = false;

        console.log('update_form : ', update_form);
            ship_order_form_state.update(() => update_form);
            ship_order_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      alert['type'] = 'check_delete';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      ship_order_modal_state.update(() => update_modal);



      let data =  table_list_data['ship_order'].getSelectedData();

      common_selected_state.update(() => data);
    
  }
  if(title === 'print'){
    let data =  table_list_data['ship_order'].getSelectedData();

    if(data.length > 0){
      alert['type'] = 'save';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      ship_order_modal_state.update(() => update_modal);

      common_selected_state.update(() => data);
    }else{
      window.alert("데이터를 1개 이상 선택해주십시오.");
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
      console.log('table_list_state : ', table_list_state['ship_order']);
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

  if(table_modal_data['ship_order_sub']){
    table_modal_data['ship_order_sub'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  ship_order_modal_state.update(() => update_modal);
  ship_order_form_state.update(() => update_form);
  
}



const shipOrderSubSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
     filterd_data = table_modal_data['real_ship_order_sub'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['real_ship_order_sub'].setData(filterd_data);
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
  
    
      if( param['code'] === '' ||  param['company'] === ''  || param['customer'] === '' || param['name'] === '' || param['user'] === '' || param['order'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        ship_order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
       

          
        // 주문서상 납기일자 대비 지연되는 일수 구하는 로직임
        const orderShipDate = moment(update_form['order_ship_date'], 'YYYY-MM-DD');
        const realShipDate = moment(update_form['ship_date'], 'YYYY-MM-DD');

        let diffDays = realShipDate.diff(orderShipDate,'days');
        if (realShipDate.isAfter(orderShipDate)) {
          diffDays = -diffDays;
        }
       
        


 
        let real_ship_order_sub = table_modal_data['real_ship_order_sub'].getData();


 
  

        const url = `${api}/ship_order/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            customer_uid : parseInt(param['customer']),
            order_uid : parseInt(param['order']),
            user_id : param['user'],
            code : param['code'],
            name  : param['name'],
            product_spec : param['product_spec'],
            ship_place : param['ship_place'],
            order_count : diffDays,
            description : param['description'],
            ship_date : param['ship_date'],
            ship_order_sub : real_ship_order_sub,
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
            
            ship_order_modal_state.update(() => update_modal);
          update_form = {
              uid : 0,
              modal: false,
              estimate : '', // 사업장
              company : '', // 사업장
              customer : '',
              customer_name : '',
              code : '',
              user : '',
              name : '',
              product_spec : "", // 제품 사양
              ship_place : "", // 납품 장소
              description : "", // 발주조건 및 기타 특이사항
              order_ship_date : moment().format('YYYY-MM-DD'), //  계약상 납품일자
              ship_date : moment().format('YYYY-MM-DD'), //  실제납품일자
              
              ship_order_sub_array : [],
              used : 1,
            };
           
            ship_order_form_state.update(()=> update_form);


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

      if( param['code'] === '' ||  param['company'] === ''  || param['customer'] === '' || param['name'] === '' || param['user'] === '' || param['order'] === ''){
      
        alert['type'] = 'save';
        alert['value'] = true;
        ship_order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {

          // 주문서상 납기일자 대비 지연되는 일수 구하는 로직임
          const orderShipDate = moment(update_form['order_ship_date'], 'YYYY-MM-DD');
          const realShipDate = moment(update_form['ship_date'], 'YYYY-MM-DD');

          let diffDays = realShipDate.diff(orderShipDate,'days');
          if (realShipDate.isAfter(orderShipDate)) {
            diffDays = -diffDays;
          }
          console.log(orderShipDate,realShipDate);
       
        const url = `${api}/ship_order/update`
        
        try {
  
        
          let params = {
            uid : param.uid,
            company_uid : parseInt(param['company']),
            customer_uid : parseInt(param['customer']),
            order_uid : parseInt(param['order']),
            user_id : param['user'],
            code : param['code'],
            name  : param['name'],
            product_spec : param['product_spec'],
            ship_place : param['ship_place'],
            order_count : diffDays,
            description : param['description'],
            ship_date : param['ship_date'],
          
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
            ship_order_modal_state.update(() => update_modal);
            update_form = init_form_data;
            ship_order_form_state.update(()=> update_form);
            select_query('ship_order');
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

          const url = `${api}/ship_order/delete`
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
              ship_order_modal_state.update(() => update_modal);
              ship_order_form_state.update(()=>update_form);

              select_query('ship_order');
    
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


  const printContent = async(data) => {
  
    let check_data = [];
    let test_sub_data = [];
  
  
    if (Array.isArray(data) && data.length > 0) {
      for (const item of data) {
        const url = `${api}/ship_order_sub/uid_select`;
        const params = { ship_order_uid : item['uid'] };
        const config = {
          params: params,
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        try {
          const res = await axios.get(url, config);
            
      
          let page_qty = 0; 
          page_qty = Math.ceil(res.data.length / 14);
          const  dataArray = res.data;
        
          for(let i =0; i<page_qty; i++){
            let newItem = { ...item }; // 객체의 복사본 생성 (spread 연산자 사용)

            let ship_order_sub = []; // 각 페이지별 들어갈 품목 데이터
            for (let j = 0; j < dataArray.length; j += 14) {
             
              const slicedData = dataArray.slice(j, j + 14); // 14개씩 잘라낸 데이터
              ship_order_sub.push(slicedData); // 각 슬라이스된 배열을 독립적인 요소로 추가
            }
              newItem['pageNo'] = i+1 // newItem에 first_data 배열을 추가
              newItem['pageQty'] = page_qty; 
              newItem['ship_order_sub'] = ship_order_sub[i]; // newItem에 first_data 배열을 추가
              check_data.push(newItem); // test_data 배열에 newItem 추가
          
          }


        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  
    
  
    const generateA4Pages = (check_data) => {
      
      const pages = check_data.map((item, index) => {
       
  
        let theme = "black";

          let ship_order_sub_data = item['ship_order_sub'];
      
                  
          const productDetails = ship_order_sub_data.length > 0 && ship_order_sub_data.map((item2, index2) => `
           
  
  
        <tr>
    
          <td style="text-align : center; "class="info-bottom-border info-left-border info-right-border">${index2+1}</td>
          <td style="text-align : left; "class="info-bottom-border">${item2.item.ingr_eng_name}</td>
          <td style="text-align : left; "class="info-bottom-border">${item2.item.ingr_kor_name}</td>
          <td style="text-align : left; "class="info-bottom-border">${item2.unit}</td>

          
          
          
          <td style="text-align : right; "class="info-bottom-border info-left-border ">${commaNumber(item2.qty)}</td>
          <td style="text-align : right; "class="info-bottom-border info-left-border">${commaNumber(item2.price)}</td>
          
          <td style="text-align : right; "class="info-bottom-border info-left-border">${commaNumber(item2.supply_price)}</td>
          <td style="text-align : right; "class="info-bottom-border info-left-border">${commaNumber(item2.vat_price)}</td>
          <td style="text-align : right; "class="info-bottom-border info-left-border info-right-border">${commaNumber(item2.description)}</td>
          
        </tr>
            
          `).join('');

          const tempDetails = Array.from({ length: 20 -  ship_order_sub_data.length}, (_, index) => `
          <tr>
            <td style="text-align: center;" class="info-bottom-border info-left-border info-right-border">${ ship_order_sub_data.length+index+1}</td>
            <td style="text-align: left;" class="info-bottom-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
            <td style="text-align: right;" class="info-bottom-border info-left-border info-right-border"></td>
          </tr>
         `).join('');
  
  
    
          return `
            <html>
              <head>
              <style>
              @media screen {
              
                body {
                  visibility: hidden;
                }
              }
              @media print {
                 @page {
                   size: A4;
                  
                   margin: 0.5cm;
                 }
                 body {
                  visibility: visible;
                   font-family: 'Nanum Gothic', sans-serif;
                   margin: 0;
                   padding: 0px 30px 0px 5px;
                 box-sizing: border-box;
     
                   background-color: #fff;
                   display: flex;
                   flex-direction: column;
                 }
                 .container {
                   width: 100%;
                   height: 95%;
                    
                 }
                 .theme-border {
                   border: 3px solid ${theme};
                   border-radius: 10px;
                   padding: 10px; /* 예시로 padding을 추가하여 테두리가 둥글게 나타날 수 있도록 함 */
                   padding-top : 10px;
     
                 }
           
                 .header {
                   text-align: center;
                   padding: 10px 0;
                   
                 }
                 .header_sub {
                     text-align: center;
                     display : flex;
                     flex-direction : row;
                     padding: 10px 0;
                     
                   }
                 .top_title {
                     text-align: center;
                     font-size : 24px;
                     font-weight : bold;
                     text-decoration: underline;
                     color : ${theme};
                   }
                   .top_title_sub {
                     width : "30%",
                     text-align: center;
                     font-size : 16px;
                     color : ${theme};
                   
                   }
               
     
     
              
     
                 .content {
                   padding: 20px 0;
                 }
                 .bottom_footer {
                   text-align: left;
                   padding: 10px 0 10px 0;
                   
                 }
     
                 .table-container {
                     //border-collapse: collapse;
                   }
               
                   .table-container table, .table-container th, .table-container td {
                     border: none;
                   }
               
                   .table-container th, .table-container td {
                     padding: 3px; /* 원하는 패딩 값 설정 */
                   }
     
                   .table_row {
                     padding: 5px; 
     
                     display:flex; flex-direction : row;
                   }
     
     
                   .info-table-container {
                     border: 2px solid ${theme}; /* 테이블의 전체 border 색상 설정 */
                     border-collapse: collapse;
                   
                   }
                
               
                   .info-table-container th, .info-table-container td {
                     border: 1px solid ${theme}; /* 각 셀의 border 색상 설정 */
                     padding: 1px; /* 원하는 패딩 값 설정 */
                     font-size:12px;
                   }
                  
                   
                     td.info-no-border{
                         border: none; /* 모든 테두리 없애기 */
                     }
                 
                     td.info-top-border {
                         border-top: none; /* 위쪽 테두리 없애기 */
                     }
                 
                     td.info-right-border {
                         border-right: none; /* 오른쪽 테두리 없애기 */
                     }
                 
                     td.info-bottom-border {
                         border-bottom: none; /* 아래쪽 테두리 없애기 */
                     }
                 
                     td.info-left-border {
                         border-left: none; /* 왼쪽 테두리 없애기 */
                     }
     
     
                     .info-sub-table-container {
                         margin-top : 10px;
                         border: 2px solid ${theme}; /* 테이블의 전체 border 색상 설정 */
                         border-collapse: collapse;
                         width: 100%;
                       }
                    
                   
                       .info-sub-table-container th, .info-sub-table-container td {
                         border: 1px solid ${theme}; /* 각 셀의 border 색상 설정 */
                         padding: 1px; /* 원하는 패딩 값 설정 */
                         font-size:12px;
                       }
                       td.info-no-border{
                         border: none; /* 모든 테두리 없애기 */
                     }
                 
                     td.info-top-border {
                         border-top: none; /* 위쪽 테두리 없애기 */
                     }
                 
                     td.info-right-border {
                         border-right: none; /* 오른쪽 테두리 없애기 */
                     }
                 
                     td.info-bottom-border {
                         border-bottom: none; /* 아래쪽 테두리 없애기 */
                     }
                 
                     td.info-left-border {
                         border-left: none; /* 왼쪽 테두리 없애기 */
                     }
     
     
     
     
         
         
               
                      
                 
     
               }
              </style>
              </head>
              <body class="page">
              <div class="container theme-border">
              <div class="header">
                <span class="top_title">출&nbsp;&nbsp;하&nbsp;&nbsp;지&nbsp;&nbsp;시&nbsp;&nbsp;서 </span>
               </div>
              
               
                       <div class="table-container">
                           <table class="table-with-border">
                           <thead>
                               <tr>
                                   <th  style="width : 50px; text-align : left; color : ${theme};">수 신 : </th>
                                   <th  style="width : 250px; text-align : left;">${item['customer']['name']} 귀하</th>
                                   <th  style="width : 50px; text-align : left;"></th>
                                   <th style="width : 50px; text-align : left; color : ${theme};">발 신 :</th>
                                   <th style="width : 300px; text-align : left; color : black;">${CLIENT_INFO.company_name}</th>
                                  
                               </tr>    
                              
                           </thead>
                           </table>
                       </div>
       
                       <div style="display:flex; flex-direction : row; width : 100%;" >
                           <div style="display:flex; flex-direction : column; width : 50%;" class="table-container">
                               <div class="table_row">
                                   
                                   <div style="text-align : left; color : black;">아래와 같은 내용으로 납품해야 하오니 납기일까지 납기장소에 납품하여 주시기 바랍니다. </div>
                                  
                               </div>
                               <div class="table_row">
                                   
                                <div style="text-align : left; color : black;">1. 주문번호 : ${item['code'] !== '' ? item['code'] : '-'} </div>
                              
                              </div>
                              <div class="table_row">
                                      
                              <div style="text-align : left; color : black;">2. 납기일자 : ${item['ship_date'] !== '' ? item['ship_date'] : '-'}</div>
                              
                          </div>
                           
                               
       
                            
                                 
                           </div>
                           <div style="display:flex; flex-direction : row; justify-content: flex-end; width : 50%;" class="table-container">
                           <div class="info-table-container">
                              
                           <table>
                           <tbody>
                       <tr >
                           <td  class="info-no-border" style="writing-mode: vertical-lr; letter-spacing: 30px;" rowspan="4">공급자</td>
                           <td  class="info-top-border">사업자번호</td>
                           <td  class="info-top-border info-right-border info-left-border" colspan="3">${CLIENT_INFO.code}</td>
                         </tr>
                         <tr>
                           <td  class="info-bottom-border info-top-border">상호</td>
                           <td class="info-bottom-border info-top-border info-left-border">${CLIENT_INFO.company_name}</td>
                           <td class="info-bottom-border info-right-border info-top-border info-left-border">성명</td>
                           <td class="info-bottom-border info-top-border info-right-border">${CLIENT_INFO.name}</td>
                         </tr>
                         <tr>
                           <td class="">사업장주소</td>
                           <td class="info-left-border info-right-border" colspan="3">${CLIENT_INFO.address}</td>
                         </tr>
                         <tr>
                           <td class="info-top-border info-bottom-border ">TEL</td>
                           <td class="info-top-border info-bottom-border info-left-border">${CLIENT_INFO.tel}</td>
                           <td class="info-top-border info-bottom-border info-left-border info-right-border">FAX</td>
                           <td class="info-top-border info-bottom-border info-right-border">${CLIENT_INFO.fax}</td>
                         </tr>
                           </tbody>
                         </table>
                              
                           </div>
                       </div>
                     
                       
                       </div>
       
       
       
       
       
       
       
       
                       <div style="display:flex; flex-direction : row; width : 100%;" class="table-container">
                       <div class="info-sub-table-container">
                          
                       <table>
                       <tbody>
                       <tr >
                       <td style="width : 40px; text-align:center; font-weight : 600" class="info-no-border">순 서</td>
                       <td style="width : 200px; text-align:center; font-weight : 600" class="info-bottom-border info-top-border">성 분 명</td>
                       <td style="width : 200px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">한 글 명</td>
                       <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">용 량</td>
                       <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">수량</td>
                       
                       <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">단가</td>
                       <td style="width : 150px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">공급가액</td>
                       <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">부가세</td>

                       
                       <td style="width : 200px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border info-right-border">비고</td>
                       
                       
                       </tr>
       
                       ${productDetails}
                       ${tempDetails}
                          
                       </tbody>
                      
                     </table>
                       
                     
           
                       </div>
                   </div>
       
                   <div class="bottom_footer">
                 
                   <span style="text-align : left;">&nbsp;&nbsp;&nbsp;합계(VAT 포함) : ${commaNumber(item.totalSupplyPrice+item.totalVatPrice)}</span>


                   <p> 3. 제품사양 : ${item['product_spec']}</p>
                   <p> 4. 납품장소 :  ${item['ship_place']}</p>
                   <p> 5. 발주조건 및 기타 특이사항 ${item['description']}</p>
                 
      
              
                  
                    
                
                   </div>
       
       
       
                     
                   
            </div>
       
  
  
              
  
            
    
              </body>
            </html>
          `;
        
      });
    
      // pages는 Promise 객체의 배열이므로 Promise.all을 사용하여 모든 페이지의 HTML을 얻은 뒤 반환합니다.
      return Promise.all(pages).then(htmlPages => htmlPages.join(''));
     
    }
    
   
    const originalContent = document.body.innerHTML;
  
    const closePopup = () => {
      document.body.innerHTML = originalContent;
      printWindow.close();
      
    };
    
   
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
  
    generateA4Pages(check_data)
      .then(content => {
        printWindow.document.write(content);
        printWindow.document.close();
        // 프린트 다이얼로그가 열릴 때 현재 창의 내용을 복원
        printWindow.onload = () => {
        
          // 프린트 다이얼로그 호출
          printWindow.print();
        };

        // 프린트 다이얼로그가 닫힐 때 현재 창의 내용을 원복
        printWindow.onafterprint = () => {
          
          printWindow.close();
        };



        // 프린트 다이얼로그가 열릴 때 현재 창의 내용을 복원
      

        // 프린트 다이얼로그 호출
        printWindow.print();
       
      })
      .catch(error => {
        console.error(error);
      });
  
   
  };



const orderSearchModalOpen = (title : any) => {


    
  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  order_modal['title'] = title;
  order_modal[title]['use'] = true;
  order_modal[title]['title'] = title;
 
  order_modal_state.update(() => order_modal);
 
 }


const orderSearchTable = (table_state,type,tableComponent,select,title) => {


  const url = `${api}/${type}/${select}`; 
 
  const config = {
  
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      if(table_modal_state['ship_order_order_search']){
        table_modal_state['ship_order_order_search'].destory();
      }
 
      if(res.data.length > 0){
      let data = res.data;
  
 
            table_modal_data['ship_order_order_search'] =   new Tabulator(tableComponent, {
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
  
              columns: MODAL_TABLE_HEADER_CONFIG['ship_order_order_search'],
              
         
             
              });
              table_modal_state.update(()=> table_modal_data);
           
    }
  })
        
 }
 



const orderSelect = async(row) => {
   


  let new_data = row.getRow().getData();
  


  update_form['order'] = new_data['uid'];
  update_form['customer'] = new_data['customer']['uid'];
  update_form['customer_name'] = new_data['customer']['name'];
  
  update_form['code'] = new_data['code'];
  update_form['name'] = new_data['name'];
  
  

  update_form['product_spec'] = new_data['product_spec'];
  update_form['order_ship_date'] = new_data['ship_date'];
  update_form['ship_place'] = new_data['ship_place'];
  update_form['description'] = new_data['description'];
  
  
  
  const url = `${api}/order_sub/uid_select`

     
  let params = 
  {
    order_uid : new_data['uid'],

  };
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }

  await axios.get(url,config).then(res=>{
        
    let data =  res.data;
   
    if(data.length > 0){
      for(let i =0; i<data.length; i++){
        data[i]['item_uid'] = data[i]['item']['uid'];

  
  
      }
    }
    if(table_modal_state['ship_order_sub']){
      
      table_modal_data['ship_order_sub'].setData(data);
      table_modal_state.update(()=> table_modal_data);
    }else{
     
      if(table_modal_data['ship_order_sub'] ){
        table_modal_data['ship_order_sub'].setData(data);
        table_modal_state.update(()=> table_modal_data);
      }
    
    }
  
    
  });

    order_modal['ship_order_order_search']['use'] = !order_modal['ship_order_order_search']['use'];
    order_modal_state.update(() => order_modal); 
    ship_order_form_state.update(()=> update_form);

  
}


const shipOrderSubModalTable = async(table_modal_state,type,tableComponent,title) => {
  let data ;

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

    ship_order_form_state.update(()=> update_form);      
    table_modal_state.update(()=> table_modal_data);

  }
  if(title === 'update'){

    const url = `${api}/ship_order_sub/uid_select`
    
       
    let params = 
    {
      ship_order_uid : update_form['uid'],

    };

    console.log('params : ', params);
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
        
        if(res.data.length > 0){
          for(let i=0; i<res.data.length; i++){
            res.data[i]['lot'] = res.data[i]['stock']['lot'];
            res.data[i]['factory'] = res.data[i]['stock']['factory'];
            res.data[i]['factorySub'] = res.data[i]['stock']['factorySub'];
             

          }

        }
     

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

    ship_order_form_state.update(()=> update_form);      
    table_modal_state.update(()=> table_modal_data);

  }
    

}


const orderSearchModalClose = (title) => {
  order_modal['title'] = '';
  order_modal[title]['use'] = !order_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  order_modal_state.update(() => order_modal);
 

}


const barcodeScan = async(data) => {
  let ship_order_sub = table_modal_data['ship_order_sub'].getData();
  if(ship_order_sub.length > 0){
    let inko = new Inko();
    let barcode = inko.ko2en(data);

    if(barcode !== ''){
        let company = getCookie('company_uid');

  
        const url = `${api}/stock/packing_lot_select`
        let params = 
        {
          lot : barcode,
          company_uid : company,
        
  
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
  
            let ship_order_sub = table_modal_data['ship_order_sub'].getData();
  
            let real_ship_order_sub = table_modal_data['real_ship_order_sub'].getData();
  
            for(let i=0; i<check_data.length; i++){
              let itemCheck = ship_order_sub.find(item => item['item']['uid'] === check_data[i]['item']['uid']);
              
              let lotCheck = real_ship_order_sub.find(item => item['lot'] === check_data[i]['lot']);

              if(itemCheck){

                if(lotCheck){
                  update_form['barcode_scan'] = '';
                  ship_order_form_state.update(()=> update_form);

                  return window.alert('납품 목록에 중복된 LOT가 있습니다.');
             


                }else{
                  update_form['barcode_scan'] = '';
                  ship_order_form_state.update(()=> update_form);
                  
                  
                console.log('check_data[i]', check_data[i]);
                let newItem = { ...check_data[i] };
                
          
                newItem['stock_uid'] = newItem['uid'];
                newItem['item_uid'] = newItem['item']['uid'];
                
                for(let i=0; i<ship_order_sub.length; i++){
             
                  if( ship_order_sub[i]['item']['uid'] === newItem['item_uid']){
                    newItem['unit'] = ship_order_sub[i]['unit'];
                    newItem['price'] = ship_order_sub[i]['price'];
                    newItem['buy_price'] = ship_order_sub[i]['buy_price'];
                    newItem['supply_price'] = ship_order_sub[i]['price'] * newItem['qty'];
                    newItem['vat_price'] = newItem['supply_price'] * 0.1;
      
                  }

                }
                
                newItem['factory_uid'] = newItem['factory']['uid'];
                newItem['factory_sub_uid'] = newItem['factorySub']['uid'];
                
                newItem['qty'] = newItem['qty']; // 현재고
                 
                real_ship_order_sub.push(newItem);

                }


                 
                
              }else{
                update_form['barcode_scan'] = '';
  
                ship_order_form_state.update(()=> update_form);
                return window.alert('주문 목록에 없는 품목입니다.');
              }
            }
              
              table_modal_data['real_ship_order_sub'].setData(real_ship_order_sub);
              table_modal_state.update(()=> table_modal_data);
              update_form['barcode_scan'] = '';
  
            ship_order_form_state.update(()=> update_form);
          
          }else{
            window.alert('재고에 없는 데이터입니다.');
            update_form['barcode_scan'] = '';
  
            ship_order_form_state.update(()=> update_form);
  
          }
         
  
  
        });
  
      
  
     
  
  
  
  
    }else{
      update_form['barcode_scan'] = '';
  
      ship_order_form_state.update(()=> update_form);
      window.alert('바코드를 스캔해주세요.');
    }


  }else{
    update_form['barcode_scan'] = '';
  
    ship_order_form_state.update(()=> update_form);
    return window.alert('주문 리스트에 품목이 없습니다.주문서를 불러오기 해주세요');
  }
  


 
 


  
 

}











export {  shipOrderModalOpen,save,modalClose,orderSubModalTable,makeCustomTable,orderSearchModalOpen,orderSelect,orderSearchTable,orderSearchModalClose ,shipOrderSubModalTable,barcodeScan,shipOrderSubSelectDelete}