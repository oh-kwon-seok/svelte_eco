

//@ts-nocheck

import { writable } from 'svelte/store';
import {company_modal_state,company_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state} from '$lib/store/common/state';
import moment from 'moment';
import {select_query} from '$lib/store/common/function';
import {TOAST_SAMPLE} from '$lib/module/common/constants';

import Excel from 'exceljs';

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
let company_upload_data : any;


const init_form_data : any = {
  uid : 0,
  code : '',
  name : '',
  owner_name : '',
  owner_phone : '',
  emp_name : '',
  emp_phone : '',
  fax : '', 
  email : '',
  type : '매출',
  used : 1,

}


company_modal_state.subscribe((data) => {
    update_modal = data;
})

company_form_state.subscribe((data) => {
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
 
 



const companyModalOpen = (data : any, title : any) => {
  console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    company_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      update_form = init_form_data;
      company_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
          Object.keys(update_form).map((item)=> {    
            
            update_form[item] = data[item];
        
          }); 
            company_form_state.update(() => update_form);
            company_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_list_data['company'].getSelectedData();

      common_selected_state.update(() => data);
   
   
  }
}



const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  company_modal_state.update(() => update_modal);


}



const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      if(param['name'] === '' || param['code'] === '' || param['type'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        company_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/company/save`
        try {
  
          let params = {
            code : param.code,
            name : param.name,
            owner_name : param.owner_name,
            owner_phone : param.owner_phone,
            emp_name : param.emp_name,
            emp_phone : param.emp_phone,
            fax : param.fax,
          
            email : param.email,
            type : param.type,
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
            update_modal['add']['use'] = !update_modal['add']['use'];

            update_form = init_form_data;
            company_modal_state.update(() => update_modal);
            company_form_state.update(()=> update_form);
            select_query('company');
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
      const url = `${api}/company/update`
      try {

        let params = {
          uid : param.uid,
          code : param.code,
          name : param.name,
          owner_name : param.owner_name,
          owner_phone : param.owner_phone,
          emp_name : param.emp_name,
          emp_phone : param.emp_phone,
          fax : param.fax,

          email : param.email,
          type : param.type,
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
          company_modal_state.update(() => update_modal);
          company_form_state.update(()=> init_form_data);
          select_query('company');
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
        alert['type'] = 'check_delete';
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/company/delete`
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
              company_modal_state.update(() => update_modal);
              company_form_state.update(()=> init_form_data);

              select_query('company');
    
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
  const companyExcelUpload = (e) => {
  
    const company_config : any = [
      {header: '사업자번호', key: 'code', width: 30},
      {header: '회사명', key: 'name', width: 30},
      {header: '대표자명', key: 'owner_name', width: 30},
      {header: '대표 번호', key: 'owner_phone', width: 30},
      {header: '담당자명', key: 'emp_name', width: 30},
      {header: '담당자 번호', key: 'emp_phone', width: 30},
      {header: '팩스 번호', key: 'fax', width: 30},
      {header: '이메일', key: 'email', width: 30},
      {header: '구분', key: 'type', width: 30},
  

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
            for(let i=0; i<company_config.length; i++){
              obj[company_config[i].key] = row.values[i+1] !== '' ?  row.values[i+1] : "";

            }
            change_data.push(obj);
            
            company_upload_data = change_data;

          
          }else {

          }
          });

          return console.log('company_upload_data',company_upload_data);

          
  

        })

        const url = `${api}/company/excel_upload`
        try {
  
          let params = {
            data :  company_upload_data,
            
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
            select_query('company');
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


  const companyExcelFormDownload = () => {

    const data = [{

      code : "1104421111",
      name : "주식회사 원플",
      owner_name : "이락규",
      owner_phone : "01022221155",
      emp_name : "오권석",
      emp_phone : "01022221111",
      fax  : "0421123545",
      email  : "sale@wonpl.co.kr",
      type  : "사업장",
    },{

      code : "11044212222",
      name : "주식회사 에코바이오의학연구소",
      owner_name : "구태규",
      owner_phone : "01022221155",
      emp_name : "금정섭",
      emp_phone : "01055551111",
      fax  : "0421123545",
      email  : "psforyou@naver.com",
      type  : "매입/매출",
    },
    
  ]; 


  
    const config : any = [
      {header: '사업자번호', key: 'code', width: 30},
      {header: '회사명', key: 'name', width: 30},
      {header: '대표자명', key: 'owner_name', width: 30},
      {header: '대표 번호', key: 'owner_phone', width: 30},
      {header: '담당자명', key: 'emp_name', width: 30},
      {header: '담당자 번호', key: 'emp_phone', width: 30},
      {header: '팩스 번호', key: 'fax', width: 30},
      {header: '이메일', key: 'email', width: 30},
      {header: '구분', key: 'type', width: 30},
    
    ]; 


      try {

        let text_title : any= '거래처 업로드 형식';
       

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
          
          for(let loop = 1; loop <= 9; loop++) {
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





export {companyModalOpen,save,modalClose,companyExcelFormDownload, companyExcelUpload}