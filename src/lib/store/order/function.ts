

//@ts-nocheck

import { writable } from 'svelte/store';
import {order_modal_state,order_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';

import {estimate_modal_state} from '$lib/store/estimate/state';
import {company_modal_state} from '$lib/store/company/state';
import { businessNumber,phoneNumber,commaNumber,} from '$lib/module/common/function';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,sales_order_state,common_restric_material_state} from '$lib/store/common/state';
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
let order_data : any;
let order_upload_data : any;
let order_sub_upload_data : any;
let restric_material_data;

let selected_data : any;
let search_data : any;
let item_modal : any;

let company_modal : any;

let estimate_modal : any;


let init_form_data:any = {
    uid : 0,
    modal: false,
    company : '', // 사업장
    customer : '',
    estimate : '', // 견적서
    customer_name : '',
    code : '',
    user : '',
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    ship_date : moment().format('YYYY-MM-DD'), // 견적일자
    order_sub_array : [],
    used : 1,

}

let init_order_uid :any ;

order_modal_state.subscribe((data) => {
    update_modal = data;
})

order_form_state.subscribe((data) => {
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
sales_order_state.subscribe((data) => {
  order_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

item_modal_state.subscribe((data) => {
  item_modal = data;
})
company_modal_state.subscribe((data) => {
  company_modal = data;
})
estimate_modal_state.subscribe((data) => {
  estimate_modal = data;
})

common_restric_material_state.subscribe((data) => {
  restric_material_data = data;
})


 
const orderModalTable = async(table_modal_state,type,tableComponent,select,title) => {

  
  
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

         
         order_form_state.update(()=> update_form);

         table_modal_state.update(()=> table_modal_data);
        
          
    }else if(title === 'update'){
      const url = `${api}/order_sub/uid_select`

     
      let params = 
      {
        order_uid : update_form['uid'],

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
              let limit_country = [];
              let checkData = restric_material_data.filter((item) => {
                
                return item['ingr_std_name'] === data[i]['item']['ingr_kor_name'] || item['ingr_eng_name'] === data[i]['item']['ingr_eng_name'] 
              });
              if(checkData){

                if(checkData.length > 0){
                  for(let i=0; i<checkData.length; i++){
                    limit_country.push(checkData[i]['country_name']);
      
                  }
      
                }
      
                const uniqueArr = limit_country.filter((element, index) => {
                  return limit_country.indexOf(element) === index;
              });
              
               
                data[i]['country_name'] = uniqueArr.toString();
      
      
                // data[i]['limit_cond'] = checkData['limit_cond'];
                // console.log('checkData  :', checkData['limit_cond']);
              }else{
                data[i]['country_name'] = "제한국가 없음"
              }





            }

          }


          update_form['order_sub_array'] = data;
          
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
   

      data : update_form['order_sub_array'].length > 0 ? update_form['order_sub_array'] : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });

      update_form['modal'] = true;

         
      order_form_state.update(()=> update_form);
    
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



const orderAddRow = (e) => {
 

 


  let company_uid = getCookie('company_uid');


  
  let data = table_modal_data['order_sub'].getData();

  console.log('data : ', data);
  
  let new_obj = {
    uid : parseInt(data.length) + 1, 
    company_uid : company_uid,
    code : "",
    item : { ingr_eng_name : ""},
    country_name : "제한사항 없음",
    item_uid : 0,
    qty : 1,
    unit : "",
    price : 0,
    buy_price : 0,
    supply_price : 0,
    vat_price : 0,
    description : "",
    used : 1,
  }


  update_form['order_sub_array'].push(new_obj);
  
  order_form_state.update(()=> update_form);

  data.push(new_obj);

  console.log('data : ', data);
  table_modal_data['order_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);
  
}




const orderDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['order_sub'].getData();
  
  data.pop();
  table_modal_data['order_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const orderAllDeleteRow = () => {
 

  table_modal_data['order_sub'].setData([]);

  table_modal_state.update(()=> table_modal_data);

}



const orderModalOpen = (data : any, title : any) => {


  
 

   
    if(title === 'add'){
       
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    order_modal_state.update(() => update_modal);
   
      update_form = {
        uid : 0,
        modal: false,
        company : '', // 사업장
        estimate : '',
        customer : '',
        customer_name : '',
        code : '',
        user : '',
        name : '',
        product_spec : "", // 제품 사양
        ship_place : "", // 납품 장소
        description : "", // 발주조건 및 기타 특이사항
        ship_date : moment().format('YYYY-MM-DD'), // 견적일자
        order_sub_array : [],
        used : 1,
      };


      console.log('update_form : ', update_form);
      order_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
      alert['type'] = 'save';
      alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    order_modal_state.update(() => update_modal);

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'customer' || item === 'estimate' ){
              update_form[item] = data[item]['uid'];
             
            

          
            } else if(item === 'customer_name'){
              update_form[item] = data['customer']['name']

            }else{
              update_form[item] = data[item];
            
            }
           
        }); 

        update_form['modal'] = false;

        console.log('update_form : ', update_form);
            order_form_state.update(() => update_form);
            order_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      alert['type'] = 'check_delete';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      order_modal_state.update(() => update_modal);



      let data =  table_list_data['order'].getSelectedData();

      common_selected_state.update(() => data);
    
  }
  if(title === 'print'){
    let data =  table_list_data['order'].getSelectedData();

    if(data.length > 0){
      alert['type'] = 'save';
      alert['value'] = false;
    
      common_alert_state.update(() => alert);
      update_modal['title'] = title;
      update_modal[title]['use'] = true;
      order_modal_state.update(() => update_modal);

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
      console.log('table_list_state : ', table_list_state['order']);
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

  if(table_modal_data['order_sub']){
    table_modal_data['order_sub'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  order_modal_state.update(() => update_modal);
  order_form_state.update(() => update_form);
  
}



const orderSubSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
     filterd_data = table_modal_data['order_sub'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['order_sub'].setData(filterd_data);
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
  
    
      if( param['code'] === '' ||  param['company'] === ''  || param['customer'] === '' || param['name'] === '' || param['user'] === '' || param['estimate'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['order_sub'].getData();
  

        const url = `${api}/order/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            customer_uid : parseInt(param['customer']),
            estimate_uid : parseInt(param['estimate']),
            user_id : param['user'],
            code : param['code'],
            name  : param['name'],
            product_spec : param['product_spec'],
            ship_place : param['ship_place'],
            description : param['description'],
            ship_date : param['ship_date'],
            
            order_sub : data,
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
            
            order_modal_state.update(() => update_modal);
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
              ship_date : moment().format('YYYY-MM-DD'), // 견적일자
              
              order_sub_array : [],
              used : 1,
            };
           
            order_form_state.update(()=> update_form);


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
        order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['order_sub'].getData();
        const url = `${api}/order/update`
        
        if(data.length > 0){
          for(let i=0; i<data.length; i++){
            if(data[i]['item_uid'] === 0 || data[i]['item_uid'] === null || data[i]['item_uid'] === undefined){
              
              alert['type'] = 'save';
              alert['value'] = true;
              // order_modal_state.update(() => update_modal);
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
           
            order_sub : data,
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
            order_modal_state.update(() => update_modal);
            update_form = init_form_data;
            order_form_state.update(()=> update_form);
            select_query('order');
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

          const url = `${api}/order/delete`
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
              order_modal_state.update(() => update_modal);
              order_form_state.update(()=>update_form);

              select_query('order');
    
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
        const url = `${api}/order_sub/uid_select`;
        const params = { order_uid : item['uid'] };
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

            let order_sub = []; // 각 페이지별 들어갈 품목 데이터
            for (let j = 0; j < dataArray.length; j += 14) {
             
              const slicedData = dataArray.slice(j, j + 14); // 14개씩 잘라낸 데이터
              order_sub.push(slicedData); // 각 슬라이스된 배열을 독립적인 요소로 추가
            }
              newItem['pageNo'] = i+1 // newItem에 first_data 배열을 추가
              newItem['pageQty'] = page_qty; 
              newItem['order_sub'] = order_sub[i]; // newItem에 first_data 배열을 추가
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

          let order_sub_data = item['order_sub'];
      
                  
          const productDetails = order_sub_data.length > 0 && order_sub_data.map((item2, index2) => `
           
  
  
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

          const tempDetails = Array.from({ length: 20 -  order_sub_data.length}, (_, index) => `
          <tr>
            <td style="text-align: center;" class="info-bottom-border info-left-border info-right-border">${ order_sub_data.length+index+1}</td>
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
                  
                   
                     td.info-no-border {
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
                       td.info-no-border {
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
                <span class="top_title">견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서 (제품 사양서)</span>
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
                                   
                                   <div style="text-align : left; color : black;">아래와 같은 내용으로 발주하오니 납기일까지 납기장소에 납품하여 주시기 바랍니다. </div>
                                  
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





const orderSubItemSearchModalOpen = (title : any, data:any) => {

  console.log('data : ', data);
  init_order_uid = data.getData();
   
 
  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  item_modal['title'] = title;
  item_modal[title]['use'] = true;
  item_modal[title]['title'] = title;
 
  
 
  item_modal_state.update(() => item_modal);
 
 }

 
const estimateSearchModalOpen = (title : any) => {


    
  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  estimate_modal['title'] = title;
  estimate_modal[title]['use'] = true;
  estimate_modal[title]['title'] = title;
 
  
 
  estimate_modal_state.update(() => estimate_modal);
 
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
 
             columns: MODAL_TABLE_HEADER_CONFIG['order_item_search'],
             
        
            
             });
             table_modal_state.update(()=> table_modal_data);
          
   }
 })
       
}

const estimateSearchTable = (table_state,type,tableComponent,select,title) => {


  const url = `${api}/${type}/${select}`; 
 
  const config = {
  
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      if(table_modal_state['order_estimate_search']){
        table_modal_state['order_estimate_search'].destory();
      }
 
      if(res.data.length > 0){
      let data = res.data;
  
 
            table_modal_data['order_estimate_search'] =   new Tabulator(tableComponent, {
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
  
              columns: MODAL_TABLE_HEADER_CONFIG['order_estimate_search'],
              
         
             
              });
              table_modal_state.update(()=> table_modal_data);
           
    }
  })
        
 }
 





const orderSubitemSelect = (row) => {
   

  

  let new_data = row.getRow().getData();
  
  
  
  let checkData ; 
  checkData = table_modal_data['order_sub'].getData().find(item => item['item_uid'] === new_data['uid']);

  if(checkData){
    return window.alert('품목 리스트에 존재하는 품목입니다.');
    

  }else{
   
    init_order_uid.item_uid = new_data.uid;
    init_order_uid.item.ingr_kor_name = new_data.ingr_kor_name;
    init_order_uid.item.ingr_eng_name = new_data.ingr_eng_name;
    
    let limit_country = [];
    let checkData = restric_material_data.filter((item) => {
      
      return item['ingr_std_name'] === init_order_uid['item']['ingr_kor_name'] || item['ingr_eng_name'] === init_order_uid['item']['ingr_eng_name'] 
    });

    if(checkData){

      if(checkData.length > 0){
        for(let i=0; i<checkData.length; i++){
          limit_country.push(checkData[i]['country_name']);

        }

      }

      const uniqueArr = limit_country.filter((element, index) => {
        return limit_country.indexOf(element) === index;
    });
    
     
      init_order_uid['country_name'] = uniqueArr.toString();


      // data[i]['limit_cond'] = checkData['limit_cond'];
      // console.log('checkData  :', checkData['limit_cond']);
    }else{
      init_order_uid['country_name']= "제한국가 없음"
    }


    

    row.getRow().update(init_order_uid);

    let final_data = table_modal_data['order_sub'].getData();

    table_modal_data['order_sub'].setData(final_data)

    table_modal_state.update(()=> table_modal_data);

    item_modal['order_item_search']['use'] = !item_modal['order_item_search']['use'];
    item_modal_state.update(() => item_modal);
  
  }
}

const estimateSelect = async(row) => {
   


  let new_data = row.getRow().getData();
  


  update_form['estimate'] = new_data['uid'];
  update_form['name'] = new_data['name'];
  update_form['product_spec'] = new_data['product_spec'];
  update_form['ship_place'] = new_data['ship_place'];
  update_form['description'] = new_data['description'];
  
  
  
  const url = `${api}/estimate_sub/uid_select`

     
  let params = 
  {
    estimate_uid : new_data['uid'],

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

        let limit_country = [];
        let checkData = restric_material_data.filter((item) => {
          
          return item['ingr_std_name'] === data[i]['item']['ingr_kor_name'] || item['ingr_eng_name'] === data[i]['item']['ingr_eng_name'] 
        });
      if(checkData){

          if(checkData.length > 0){
            for(let i=0; i<checkData.length; i++){
              limit_country.push(checkData[i]['country_name']);

            }

          }

          const uniqueArr = limit_country.filter((element, index) => {
            return limit_country.indexOf(element) === index;
        });
        
         
          data[i]['country_name'] = uniqueArr.toString();


          // data[i]['limit_cond'] = checkData['limit_cond'];
          // console.log('checkData  :', checkData['limit_cond']);
        }else{
          data[i]['country_name'] = "제한국가 없음"
        }
      

      }

    }
    if(table_modal_state['order_sub']){
      
      table_modal_data['order_sub'].setData(data);
      table_modal_state.update(()=> table_modal_data);
    }else{
     
      if(table_modal_data['order_sub'] ){
        table_modal_data['order_sub'].setData(data);
        table_modal_state.update(()=> table_modal_data);
      }
    
    }
  
    
  });



 








  
 
    estimate_modal['order_estimate_search']['use'] = !estimate_modal['order_estimate_search']['use'];
    estimate_modal_state.update(() => estimate_modal);
    
    order_form_state.update(()=> update_form);

  
  
}
const estimateSearchModalClose = (title) => {
  estimate_modal['title'] = '';
  estimate_modal[title]['use'] = !estimate_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  estimate_modal_state.update(() => estimate_modal);
 

}

const orderCompanySelect = (row) => {
  

  update_form['customer'] = row.uid;
  update_form['customer_name'] = row.name;
  

  
  company_modal['order_company_search']['use'] = !company_modal['order_company_search']['use'];

  company_modal_state.update(() => company_modal);
  order_form_state.update(()=> update_form);
  
}





const companySearchModalOpen = (title : any) => {

   
  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  company_modal['title'] = title;
  company_modal[title]['use'] = true;
  company_modal[title]['title'] = title;

  

  company_modal_state.update(() => company_modal);

}

const companySearchModalClose = (title : any) => {
  company_modal['title'] = '';
  company_modal[title]['use'] = !company_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  company_modal_state.update(() => company_modal);
 

}


const companySearchTable = (table_state,type,tableComponent,select,title) => {


  const url = `${api}/${type}/${select}`; 

  const config = {
  
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      if(table_modal_state['company']){
        table_modal_state['company'].destory();
      }

      if(res.data.length > 0){
      let data = res.data;
  

            table_modal_data['company'] =   new Tabulator(tableComponent, {
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
  
              columns: MODAL_TABLE_HEADER_CONFIG['order_company_search'],
              
         
             
              });
              table_modal_state.update(()=> table_modal_data);
           
    }
  })
        
}








export {  orderModalOpen,save,modalClose,orderModalTable,orderAddRow,orderDeleteRow,orderAllDeleteRow,orderSubSelectDelete,orderSubItemSearchModalOpen,itemSearchTable,orderSubitemSelect,itemSearchModalClose,makeCustomTable,estimateSearchModalOpen,estimateSelect,estimateSearchTable,estimateSearchModalClose ,companySearchTable, companySearchModalOpen,orderCompanySelect, companySearchModalClose}