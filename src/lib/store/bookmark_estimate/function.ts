

//@ts-nocheck

import { writable } from 'svelte/store';
import {bookmark_estimate_modal_state,bookmark_estimate_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,common_bookmark_estimate_state} from '$lib/store/common/state';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
import {TOAST_SAMPLE} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';


import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER, MODAL_TABLE_HEADER_CONFIG} from '$lib/module/common/constants';
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
let bookmark_estimate_data : any;
let bookmark_estimate_upload_data : any;
let bookmark_estimate_sub_upload_data : any;

let selected_data : any;
let search_data : any;
let item_modal : any;


const init_form_data:any = {
  uid : 0,
    modal : false,
    company : '', // 사업장
    user : '',
    name : '',
    product_spec : "", // 제품 사양
    ship_place : "", // 납품 장소
    description : "", // 발주조건 및 기타 특이사항
    bookmark_estimate_sub_array : [],
    used : 1,

}

let init_bookmark_estimate_uid :any ;
let selected_bookmark_estimate_sub_data :any ;


bookmark_estimate_modal_state.subscribe((data) => {
    update_modal = data;
})

bookmark_estimate_form_state.subscribe((data) => {
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
common_bookmark_estimate_state.subscribe((data) => {
  bookmark_estimate_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

item_modal_state.subscribe((data) => {
  item_modal = data;
})


 
const bookmarkEstimateModalTable = async(table_modal_state,type,tableComponent,select,title) => {

  
  
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
          bookmark_estimate_form_state.update(()=> update_form); 
          table_modal_state.update(()=> table_modal_data);
        
          
    }else if(title === 'update'){
      const url = `${api}/bookmark_estimate_sub/uid_select`

     
      let params = 
      {
        bookmark_estimate_uid : update_form['uid'],

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
              data[i]['item_uid'] = data[i]['item']['uid']

            }

          }


          update_form['bookmark_estimate_sub_array'] = data;
          
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
        // selectable: true,
      rowClick:function(e, row){
        //e - the click event object
        //row - row component

     
        row.toggleSelect(); //toggle row selected state on row click
    },

      rowFormatter:function(row){
            row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
      },
   

      data : update_form['bookmark_estimate_sub_array'].length > 0 ? update_form['bookmark_estimate_sub_array'] : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });
      update_form['modal'] = true;
      bookmark_estimate_form_state.update(()=> update_form); 
  
      table_modal_state.update(()=> table_modal_data);
  
   

  }

  
  
}



const bookmarkEstimateAddRow = (e) => {
  e.preventDefault();

 


  let company_uid = getCookie('company_uid');


  
  let data = table_modal_data['bookmark_estimate_sub'].getData();

  console.log('data : ', data);
  
  let new_obj = {
    uid : parseInt(data.length) + 1, 
    company_uid : company_uid,
    code : "",
    item : {},

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


  update_form['bookmark_estimate_sub_array'].push(new_obj);
  
  bookmark_estimate_form_state.update(()=> update_form);

  data.push(new_obj);
  table_modal_data['bookmark_estimate_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);
  
}




const bookmarkEstimateDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['bookmark_estimate_sub'].getData();
  
  data.pop();
  table_modal_data['bookmark_estimate_sub'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const bookmarkEstimateAllDeleteRow = () => {
 

  table_modal_data['bookmark_estimate_sub'].setData([]);

  table_modal_state.update(()=> table_modal_data);

}



const bookmarkEstimateModalOpen = (data : any, title : any) => {
 console.log('data : ', data);
 //init_bookmark_estimate_uid = data.getData();

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    bookmark_estimate_modal_state.update(() => update_modal);

   
    if(title === 'add'){
      update_form = init_form_data;
      update_form['modal'] = false;
    
      bookmark_estimate_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
          
            } else{
              update_form[item] = data[item];
            
            }
           
        }); 

        update_form['modal'] = false;
          
            bookmark_estimate_form_state.update(() => update_form);
            bookmark_estimate_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      let data =  table_list_data['bookmark_estimate'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['bookmark_estimate']);
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

  if(table_modal_data['bookmark_estimate_sub']){
    table_modal_data['bookmark_estimate_sub'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  bookmark_estimate_modal_state.update(() => update_modal);
  bookmark_estimate_form_state.update(() => update_form);
  
}



const bookmarkEstimateSubSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
     filterd_data = table_modal_data['bookmark_estimate_sub'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['bookmark_estimate_sub'].setData(filterd_data);
      table_modal_state.update(()=> table_modal_data);

      }
  }




const save = (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid');
  param['user'] = getCookie('my-cookie');
  

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if(  param['company'] === ''  || param['name'] === '' || param['user'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        bookmark_estimate_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['bookmark_estimate_sub'].getData();
  

        const url = `${api}/bookmark_estimate/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            user_id : param['user'],
            name  : param['name'],
            product_spec : param['product_spec'],
            ship_place : param['ship_place'],
            description : param['description'],
            

            bookmark_estimate_sub : data,
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
            bookmark_estimate_modal_state.update(() => update_modal);

            

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
      
      let data = table_modal_data['bookmark_estimate_sub'].getData();


      const url = `${api}/bookmark_estimate/update`
      

    
     console.log('data : ', data);
    
      try {

      
        let params = {
          uid : param.uid,
          company_uid : parseInt(param['company']),
          user_id : param['user'],
          name  : param['name'],
          product_spec : param['product_spec'],
          ship_place : param['ship_place'],
          description : param['description'],
          bookmark_estimate_sub : data,
          
       
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
          bookmark_estimate_modal_state.update(() => update_modal);
          update_form = init_form_data;
          bookmark_estimate_form_state.update(()=> update_form);
          select_query('bookmark_estimate');
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

          const url = `${api}/bookmark_estimate/delete`
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
              bookmark_estimate_modal_state.update(() => update_modal);
              bookmark_estimate_form_state.update(()=>update_form);

              select_query('bookmark_estimate');
    
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


  const bookmark_estimateExcelUpload = (e) => {
  
    let company_uid = getCookie('company_uid');
    const config : any = [
      {header: '공정명', key: 'name', width: 30},
      {header: '용도', key: 'status', width: 30},
      {header: '비고', key: 'description', width: 30},
     
    
    
    ]; 


    const wb = new Excel.Workbook();
    const reader = new FileReader()

    let file = e.target.files[0];

    reader.readAsArrayBuffer(file)
    reader.onload = () => {
     let change_data = [];
     
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        console.log(workbook, 'workbook instance')
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
          
            if(rowIndex > 1){
            let obj = {

            };
            for(let i=0; i<config.length; i++){
              obj[config[i].key] = row.values[i+1] !== '' ?  row.values[i+1] : "";

            }
            change_data.push(obj);
            
            bookmark_estimate_upload_data = change_data;

          
          }else {

          }
          });

        
          
  

        })
     
          
       
        for(let i= 0; i<bookmark_estimate_upload_data.length; i++){
          bookmark_estimate_upload_data[i]['company'] = company_uid;
          
        }
        
        const url = `${api}/bookmark_estimate/excel_upload`
        try {
  
          let params = {
          
            data :  bookmark_estimate_upload_data,
            
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
            //select_query('bookmark_estimate');
            return common_toast_state.update(() => toast);
  
          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };


      })

    }

  }



  const bookmarkEstimateSubExcelUpload = (e) => {
  
    let company_uid = getCookie('company_uid');
    const config : any = [
      {header: '자동견적명', key: 'bookmark_estimate_name', width: 30},
      {header: '품목코드', key: 'item_code', width: 30},
      {header: '수량', key: 'qty', width: 30},
      {header: '단위', key: 'unit', width: 30},
      {header: '매입단가', key: 'buy_price', width: 30},
      {header: '매출단가', key: 'price', width: 30},
      {header: '공급가액', key: 'supply_price', width: 30},
      {header: '부가세', key: 'vat_price', width: 30},
      
      {header: '비고', key: 'description', width: 30},
     
    
    
    ]; 


    const wb = new Excel.Workbook();
    const reader = new FileReader()

    let file = e.target.files[0];

    reader.readAsArrayBuffer(file)
    reader.onload = () => {
     let change_data = [];
     
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        console.log(workbook, 'workbook instance')
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
          
            if(rowIndex > 1){
            let obj = {

            };
            for(let i=0; i<config.length; i++){
              obj[config[i].key] = row.values[i+1] !== '' ?  row.values[i+1] : "";

            }
            change_data.push(obj);
            
            bookmark_estimate_sub_upload_data = change_data;

          
          }else {

          }
          });

        
          
  

        })
     
          
       
        for(let i= 0; i<bookmark_estimate_sub_upload_data.length; i++){
          bookmark_estimate_sub_upload_data[i]['company'] = company_uid;
        }
        
        const url = `${api}/bookmark_estimate_sub/excel_upload`
        try {
  
          let params = {
          
            data :  bookmark_estimate_sub_upload_data,
            
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
            //select_query('bookmark_estimate');
            return common_toast_state.update(() => toast);
  
          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };


      })

    }

  }




const bookmarkEstimateSubItemSearchModalOpen = (title : any, data:any) => {

 console.log('data : ', data);
 init_bookmark_estimate_uid = data.getData();
  

 alert['type'] = 'save';
 alert['value'] = false;
 console.log('titme : ', title);
 common_alert_state.update(() => alert);
 item_modal['title'] = title;
 item_modal[title]['use'] = true;
 item_modal[title]['title'] = title;

 

 item_modal_state.update(() => item_modal);

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
 
             columns: MODAL_TABLE_HEADER_CONFIG['bookmark_estimate_search'],
             
        
            
             });
             table_modal_state.update(()=> table_modal_data);
          
   }
 })
       
}





  const bookmark_estimateExcelFormDownload = () => {

    const data = [{
      name : "계량1",
      status : "계량용",
      description : "특이사항 없음",
     
     
    },{
      name : "충진1",
      status : "충진용",
      description : "특이사항 없음",
    },
    {
      name : "포장1",
      status : "포장용",
      description : "특이사항 없음",
    },
    
  ]; 


  
    const config : any = [
      {header: '공정명', key: 'bookmark_estimate_name', width: 30},
      {header: '검사명', key: 'name', width: 30},
      {header: '용도', key: 'status', width: 30},
      {header: '비고', key: 'description', width: 30},
      
    
    
    ]; 


      try {

        let text_title : any= '공정 업로드 형식';
       

      const workbook = new Excel.Workbook();
        // 엑셀 생성
  
        // 생성자
        workbook.creator = '작성자';
       
        // 최종 수정자
        workbook.lastModifiedBy = '최종 수정자';
       
        // 생성일(현재 일자로 처리)
        workbook.created = new Date();
       
        // 수정일(현재 일자로 처리)
        workbook.modified = new Date();

        let file_name = text_title + moment().format('YYYY-MM-DD HH:mm:ss') + '.xlsx';
        let sheet_name = moment().format('YYYYMMDDHH:mm:ss');
     
      
        workbook.addWorksheet(text_title);
           

        const sheetOne = workbook.getWorksheet(text_title);
             
             
              
        // 컬럼 설정
        // header: 엑셀에 표기되는 이름
        // key: 컬럼을 접근하기 위한 key
        // hidden: 숨김 여부
        // width: 컬럼 넓이
        sheetOne.columns = config;
     
        const sampleData = data;
        const borderStyle = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
       
        sampleData.map((item, index) => {
          sheetOne.addRow(item);
       
          // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
          
          for(let loop = 1; loop <= config.length; loop++) {
            const col = sheetOne.getRow(index + 2).getCell(loop);
            col.border = borderStyle;
            col.font = {name: 'Arial Black', size: 10};
          }
        
      });
  
  
          
     
        workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = file_name;
          anchor.click();
          window.URL.revokeObjectURL(url);
        })
      } catch(error) {
        console.error(error);
      }

   
}
const bookmarkEstimateSubitemSelect = (row) => {
   

  

  let new_data = row.getRow().getData();
  
  
  
  let checkData ; 
  checkData = table_modal_data['bookmark_estimate_sub'].getData().find(item => item['item_uid'] === new_data['uid']);

  if(checkData){
    return window.alert('레시피 리스트에 존재하는 품목입니다.');
    

  }else{
   
    init_bookmark_estimate_uid.item_uid = new_data.uid;
    init_bookmark_estimate_uid.item.ingr_kor_name = new_data.ingr_kor_name;
    init_bookmark_estimate_uid.item.ingr_eng_name = new_data.ingr_eng_name;
    
    

    row.getRow().update(init_bookmark_estimate_uid);

    let final_data = table_modal_data['bookmark_estimate_sub'].getData();

    table_modal_data['bookmark_estimate_sub'].setData(final_data)

    table_modal_state.update(()=> table_modal_data);

    item_modal['bookmark_estimate_search']['use'] = !item_modal['bookmark_estimate_search']['use'];
    item_modal_state.update(() => item_modal);
  
  }
}




const bookmarkEstimateSubExcelFormDownload = () => {

    const data = [{
      bookmark_estimate_name : "한국용",
      item_code : "BA354890",
      qty : 2,
      unit : "EA",
      price : 90000,
      supply_price : 180000,
      vat_price : 18000, 
      description : "수출용"
    },{
      bookmark_estimate_name : "중국용",
      item_code : "PH-SA-FLO_FER",
      qty : 5,
      unit : "EA",
      price : 50000,
      supply_price : 250000,
      vat_price : 25000, 
    
      description : "내수용"
    },
    
    
  ]; 

  const config : any = [
    {header: '자동견적명', key: 'bookmark_estimate_name', width: 30},
    {header: '품목코드', key: 'item_code', width: 30},
    {header: '수량', key: 'qty', width: 30},
    {header: '단위', key: 'unit', width: 30},
    {header: '단가', key: 'price', width: 30},
    {header: '공급가액', key: 'supply_price', width: 30},
    {header: '부가세', key: 'vat_price', width: 30},
    
    {header: '비고', key: 'description', width: 30},
  
  
  ]; 


    try {

      let text_title : any= '자동견적 품목 업로드 형식';
     

    const workbook = new Excel.Workbook();
      // 엑셀 생성

      // 생성자
      workbook.creator = '작성자';
     
      // 최종 수정자
      workbook.lastModifiedBy = '최종 수정자';
     
      // 생성일(현재 일자로 처리)
      workbook.created = new Date();
     
      // 수정일(현재 일자로 처리)
      workbook.modified = new Date();

      let file_name = text_title + moment().format('YYYY-MM-DD HH:mm:ss') + '.xlsx';
      let sheet_name = moment().format('YYYYMMDDHH:mm:ss');
   
    
      workbook.addWorksheet(text_title);
         

      const sheetOne = workbook.getWorksheet(text_title);
           
           
            
      // 컬럼 설정
      // header: 엑셀에 표기되는 이름
      // key: 컬럼을 접근하기 위한 key
      // hidden: 숨김 여부
      // width: 컬럼 넓이
      sheetOne.columns = config;
   
      const sampleData = data;
      const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
     
      sampleData.map((item, index) => {
        sheetOne.addRow(item);
     
        // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
        
        for(let loop = 1; loop <= config.length; loop++) {
          const col = sheetOne.getRow(index + 2).getCell(loop);
          col.border = borderStyle;
          col.font = {name: 'Arial Black', size: 10};
        }
      
    });


        
   
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file_name;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })
    } catch(error) {
      console.error(error);
    }

 
}






  





export {bookmarkEstimateModalOpen,save,modalClose,bookmarkEstimateModalTable,bookmarkEstimateAddRow,bookmarkEstimateDeleteRow,bookmarkEstimateAllDeleteRow,bookmarkEstimateSubSelectDelete,bookmarkEstimateSubItemSearchModalOpen,itemSearchTable,bookmarkEstimateSubitemSelect,itemSearchModalClose,bookmarkEstimateSubExcelUpload,bookmarkEstimateSubExcelFormDownload }