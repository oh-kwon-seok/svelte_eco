

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {factory_modal_state,factory_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber,commaNumber} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER,CLIENT_INFO} from '$lib/module/common/constants';

import Excel from 'exceljs';
import { end } from '@popperjs/core';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';
const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_list_data : any;

let selected_data : any;


const init_form_data:any = {
  uid : 0,
    
  name : '',
  status : '',
  description : '',
  company : '',
  factory_sub_array : [],
  used : 1,

}


factory_modal_state.subscribe((data) => {
    update_modal = data;
})

factory_form_state.subscribe((data) => {
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
table_list_state.subscribe((data) => {
  table_list_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})


 


const factoryModalOpen = (data : any, title : any) => {
 
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    factory_modal_state.update(() => update_modal);

    
    if(title === 'add'){
      update_form = init_form_data;
      factory_form_state.update(() =>update_form);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
          if(item === 'company'  ){
            update_form[item] = data[item]['uid'];
          }
            else if(item === 'factory_sub_array'){
              if(data[item] !== null){
                update_form[item] = JSON.parse(data[item]);
              }else{
                update_form[item] = [];
              }
            }else{
              update_form[item] = data[item];
            }
        }); 
        
            factory_form_state.update(() => update_form);
            factory_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_list_data['factory'].getSelectedData();

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
      table_list_data[type].setData(res.data);
      table_list_state.update(() => table_list_data);
     
   })

}


const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  factory_modal_state.update(() => update_modal);


}

const save = (param,title) => {

  param['company'] = getCookie('company_uid');
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
  
   
    if(title === 'add'){
      let checked_data;
   
    
      if(param.factory_sub_array.length > 0){
        
        checked_data = param.factory_sub_array.filter(item => {
          return item.name !== "" && item.name !== undefined && item.name !== null 
        })

      }
     
      

    
      if( param['company'] === '' || param['name'] === ''   ){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        factory_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      

         console.log('param : ', param);
        const url = `${api}/factory/save`
        try {
  
          
          let params = {
            company_uid : param.company,
            name : param.name,
            status : param.status,
            description : param.description,
            used : param.used,
            factory_sub_array : JSON.stringify(checked_data),
            factory_sub : checked_data,
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            factory_modal_state.update(() => update_modal);
            select_query('factory');
            

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
      const url = `${api}/factory/update`
      
    
      let checked_data;
   
    
      if(param.factory_sub_array.length > 0){
        
        checked_data = param.factory_sub_array.filter(item => {
          return item.name !== "" && item.name !== undefined && item.name !== null 
        })

      }

        
        let params = {

          uid : param.uid,
          company_uid : param.company,
          name : param.name,
          status : param.status,
          description : param.description,
          used : param.used,
          factory_sub_array : JSON.stringify(checked_data),
          factory_sub : checked_data,
          token : login_data['token'],

        };

        console.log('param : ', param);

      axios.post(url,
        params,
      ).then(res => {
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          factory_modal_state.update(() => update_modal);
          factory_form_state.update(()=>update_form);
          select_query('factory');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      


     
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

          const url = `${api}/factory/delete`
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
              factory_modal_state.update(() => update_modal);
              factory_form_state.update(()=>update_form);

              select_query('factory');
    
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




const factoryExcelDownload = (type,config) => {
  
  let data =  table_list_data[type].getSelectedData();
  console.log('data  : ', table_list_data[type].getSelectedData());

  
  if(data.length > 0){
    // 모든 객체에서 공통된 키(key) 이름을 찾기 위한 반복문
    for (let i = 0; i <  data.length; i++) {
      let currentObject =  data[i];

      Object.keys(currentObject).map((key)=> {    
      
       
          data[i][key] = data[i][key];
        

        if(typeof currentObject[key] === "object"){
          data[i][key] = data[i][key]['name'];
        } else {
          data[i][key] = data[i][key];
        }
      
      }); 
    }

    try {

      let text_title : any= '';
      switch(type){
          case 'factory': 
              text_title = '공장 관리';
          break;
          
          default:
              text_title = '제목 없음';
          break;
    }

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
        
        for(let loop = 1; loop <= 6; loop++) {
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

  }else{
    alert('데이터를 선택해주세요');
  }

}


const factorySubAddRow = () => {
  let new_obj = {
    uid : parseInt(update_form['factory_sub_array'].length) + 1, 
    name : '',
    status : '',
    description : '',
  }


  update_form['factory_sub_array'].push(new_obj);
  console.log('update_form : ', update_form);
  factory_form_state.update(()=> update_form);

}
const factorySubDeleteRow = () => {
  console.log('눌림');

  update_form['factory_sub_array'].pop();

  factory_form_state.update(()=> update_form);

}
const factorySubAllDeleteRow = () => {
 

  update_form['factory_sub_array'] = [];

  factory_form_state.update(()=> update_form);

}
const factorySubSelectDeleteRow = (index) => {
  


  update_form['factory_sub_array'].splice(index,1);
  
  factory_form_state.update(()=> update_form);

}


export {factoryModalOpen,modalClose,factoryExcelDownload,save,factorySubAddRow,factorySubDeleteRow,factorySubAllDeleteRow,factorySubSelectDeleteRow}