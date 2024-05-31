

//@ts-nocheck

import { writable } from 'svelte/store';
import {process_modal_state,process_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,common_process_state} from '$lib/store/common/state';
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
let process_data : any;
let process_upload_data : any;
let process_qc_upload_data : any;

let selected_data : any;
let search_data : any;
let item_modal : any;


const init_form_data:any = {
    uid : 0,
    company : '', // 사업장
    modal : false,
    name : '',
    stauts : '',
    process_qc_array : [],
    description : '', // 사용자이름
    used : 1,

}

let init_process_uid :any ;
let selected_process_sub_data :any ;


process_modal_state.subscribe((data) => {
    update_modal = data;
})

process_form_state.subscribe((data) => {
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
common_process_state.subscribe((data) => {
  process_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

item_modal_state.subscribe((data) => {
  item_modal = data;
})


 
const processModalTable = async(table_modal_state,type,tableComponent,select,title) => {

  
  
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

          process_form_state.update(()=> update_form);
          
          table_modal_state.update(()=> table_modal_data);
        
          
    }else if(title === 'update'){

     
      if(table_modal_state[type]){
        table_modal_state[type].destory();
      }


      if( update_form['process_qc_array'].length > 0){
        for(let i=0; i<update_form['process_qc_array'].length; i++){
          if(update_form['process_qc_array'][i]['type'] === 0){
            update_form['process_qc_array'][i]['type'] = "합불";

          }else{
            update_form['process_qc_array'][i]['type'] = "수치";
          }

        }

      }else{

        let url = `${api}/process_qc/info_select`;
        let params = { process_uid : update_form.uid};
        const config = {
          params : params,
          headers:{
            "Content-Type": "application/json",
            
          }
        }

        await axios.get(url,config).then(res=>{
            
          let data =  res.data;
          console.log('data : ', data);

          if(data.length > 0){
            for(let i=0; i<data.length; i++){
              if(data[i]['type'] === 0){
                data[i]['type'] = "합불";
    
              }else{
                data[i]['type'] = "수치";
              }
    
            }
    
          }

          update_form['process_qc_array'] = data;
          
        });




      }

      console.log('qc_array : ', update_form['process_qc_array']);
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
   

      data : update_form['process_qc_array'].length > 0 ? update_form['process_qc_array'] : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });

      update_form['modal'] = true;

      process_form_state.update(()=> update_form);
    
      table_modal_state.update(()=> table_modal_data);
  
   

  }

  
  
}



const processAddRow = (e) => {
  e.preventDefault();

 


  let company_uid = getCookie('company_uid');


  
  let data = table_modal_data['process_qc'].getData();

  console.log('data : ', data);
  
  let new_obj = {
    uid : parseInt(data.length) + 1, 
    company_uid : company_uid,
    
    name: "검사명",
    type : '합불',
    used : 1,
  }


  update_form['process_qc_array'].push(new_obj);
  
  process_form_state.update(()=> update_form);

  data.push(new_obj);
  table_modal_data['process_qc'].setData(data);
  table_modal_state.update(()=> table_modal_data);
  
}




const processDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['process_qc'].getData();
  
  data.pop();
  table_modal_data['process_qc'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const processAllDeleteRow = () => {
 

  table_modal_data['process_qc'].setData([]);

  table_modal_state.update(()=> table_modal_data);

}



const processModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    process_modal_state.update(() => update_modal);

   
    if(title === 'add'){
      update_form = init_form_data;

      update_form['modal'] = false;

      process_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){

   

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
             
          
            } 
            else if(item === 'process_qc_array'){
              if(data[item] !== null){
                update_form[item] = JSON.parse(data[item]);
              }else{
                update_form[item] = [];
              }
            }else{
              update_form[item] = data[item];
            
            }
           
        }); 

            update_form['modal'] = false;

          
            process_form_state.update(() => update_form);
            process_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      let data =  table_list_data['process'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['process']);
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

  if(table_modal_data['process_qc']){
    table_modal_data['process_qc'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  process_modal_state.update(() => update_modal);
  process_form_state.update(() => update_form);
  
}



const processQcSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
     filterd_data = table_modal_data['process_qc'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['process_qc'].setData(filterd_data);
      table_modal_state.update(()=> table_modal_data);

      }
  }




const save = (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid')

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if(  param['company'] === ''  || param['name'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        process_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
        let data = table_modal_data['process_qc'].getData();
        let checked_data = data.filter(item => {
          if(item['type'] === '합불'){
            item['type'] = 0;

          }else if(item['type'] === '수치'){
            item['type'] = 1;
          }
          return item['name'] !== ""
        });

        const url = `${api}/process/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
          
            name  : param['name'],
            status : param['status'],

            process_qc_array : JSON.stringify(checked_data),
            process_qc : checked_data,
            
            description : param.description,
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
            process_modal_state.update(() => update_modal);

            

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
      
      let data = table_modal_data['process_qc'].getData();
      let checked_data = data.filter(item => {
        if(item['type'] === '합불'){
          item['type'] = 0;

        }else if(item['type'] === '수치'){
          item['type'] = 1;
        }
        return item['name'] !== ""
      });


      const url = `${api}/process/update`
      

     
      
    
      try {

      
        let params = {
          uid : param.uid,
          company_uid : parseInt(param['company']),

          name  : param['name'],
          status : param['status'],

          process_qc_array : JSON.stringify(checked_data),
          process_qc : checked_data,
          
          description : param.description,
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
          process_modal_state.update(() => update_modal);
          update_form = init_form_data;
          process_form_state.update(()=> update_form);
          select_query('process');
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

          const url = `${api}/process/delete`
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
              process_modal_state.update(() => update_modal);
              process_form_state.update(()=>update_form);

              select_query('process');
    
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


  const processExcelUpload = (e) => {
  
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
            
            process_upload_data = change_data;

          
          }else {

          }
          });

        
          
  

        })
     
          
       
        for(let i= 0; i<process_upload_data.length; i++){
          process_upload_data[i]['company'] = company_uid;
          
        }
        
        const url = `${api}/process/excel_upload`
        try {
  
          let params = {
          
            data :  process_upload_data,
            
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
            //select_query('process');
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



  const processQcExcelUpload = (e) => {
  
    let company_uid = getCookie('company_uid');
    const config : any = [
      {header: '공정명', key: 'process_name', width: 30},
      {header: '검사명', key: 'name', width: 30},
      {header: '검사유형', key: 'type', width: 30},
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
            
            process_qc_upload_data = change_data;

          
          }else {

          }
          });

        
          
  

        })
     
          
       
        for(let i= 0; i<process_qc_upload_data.length; i++){
          process_qc_upload_data[i]['company'] = company_uid;
          if(process_qc_upload_data[i]['type'] === "합불"){
            process_qc_upload_data[i]['type'] = 0;

          }else if(process_qc_upload_data[i]['type'] === "수치"){
            process_qc_upload_data[i]['type'] = 1;
          }else{
            process_qc_upload_data[i]['type'] = 0;
          }
          
        }
        
        const url = `${api}/process_qc/excel_upload`
        try {
  
          let params = {
          
            data :  process_qc_upload_data,
            
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
            //select_query('process');
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


  const processExcelFormDownload = () => {

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
      {header: '공정명', key: 'process_name', width: 30},
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



const processQcExcelFormDownload = () => {

  const data = [{
    process_name : "계량1",
    name : "검사1",
    type : "합불",
     description : "비고"
   
   
  },{
    process_name : "충진1",
    name : "검사1",
    type : "합불",
     description : "비고"
  },
  {
    process_name : "포장1",
    name : "검사1",
    type : "수치",
     description : "비고"
  },
  
]; 



  const config : any = [
    {header: '공정명', key: 'process_name', width: 30},
    {header: '검사명', key: 'name', width: 30},
    {header: '검사유형', key: 'type', width: 30},
    
    {header: '비고', key: 'description', width: 30},
  
  
  ]; 


    try {

      let text_title : any= '공정검사 업로드 형식';
     

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






  





export {processModalOpen,save,modalClose,processExcelFormDownload,processQcExcelFormDownload,processExcelUpload,processQcExcelUpload,processModalTable,processAddRow,processDeleteRow,processAllDeleteRow,processQcSelectDelete}