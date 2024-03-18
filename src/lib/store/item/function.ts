

//@ts-nocheck

import { writable } from 'svelte/store';
import {item_modal_state,item_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state} from '$lib/store/common/state';
import {loadChange} from '$lib/store/common/function';


import moment from 'moment';
import Excel from 'exceljs';
import {TOAST_SAMPLE} from '$lib/module/common/constants';

const api = import.meta.env.VITE_API_BASE_URL;
const restrict_api = import.meta.env.VITE_RESTRICT_COSMETIC_URL;
const restrict_key = import.meta.env.VITE_RESTRICT_COSMETIC_KEY;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_list_data : any;
let item_upload_data : any;

let selected_data : any;


const init_form_data:any = {
        uid : 0,
        code :  "",
        simple_code :  "",
        ingr_kor_name :  "",
        ingr_eng_name :  "",
        inout_unit :  "",
        inout_type :  "",
        currency_unit :   "",
        buy_type :  "",
        type_code :  "",
        classify_code :  "",
        component_code :  "",
        hs_code : "",
        nts_code : "",
        description : "",
        company : "",
        type : "",
        used : 1,

}


item_modal_state.subscribe((data) => {
    update_modal = data;
})

item_form_state.subscribe((data) => {
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
 
 



const itemModalOpen = (data : any, title : any) => {
 
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    item_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      update_form = init_form_data;
      item_form_state.update(() =>update_form);
     
    }
    if(title === 'update' ){
       
   
        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ||  item === 'type'){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            item_form_state.update(() => update_form);
            item_modal_state.update(() => update_modal);
        

    }
    if(title === 'check_delete'){
      let data =  table_list_data['item'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['item']);
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
  common_alert_state.update(() => alert);
  item_modal_state.update(() => update_modal);


}



const save = (param,title) => {

  console.log(param);

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      if(param['code'] === '' || param['type'] === '' || param['company'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        item_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/item/save`
        try {
  
          
          let params = {

            
            code: param.code,
            simple_code: param.simple_code,
            ingr_kor_name: param.ingr_kor_name,
            ingr_eng_name: param.ingr_eng_name,
            inout_unit: param.inout_unit,
            inout_type: param.inout_type,
            currency_unit: param.currency_unit,
            buy_type: param.buy_type,
            type_code: param.type_code,
            classify_code: param.classify_code,
            component_code: param.component_code,
            hs_code:param.hs_code,
            nts_code:param.nts_code,
            description:param.description,
            company_uid:param.company,
            type_uid:param.type,
            
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
            item_modal_state.update(() => update_modal);

            select_query('item');

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
      const url = `${api}/item/update`
      try {

        let params = {
          uid : param.uid,
          code: param.code,
          simple_code: param.simple_code,
          ingr_kor_name: param.ingr_kor_name,
          ingr_eng_name: param.ingr_eng_name,
          inout_unit: param.inout_unit,
          inout_type: param.inout_type,
          currency_unit: param.currency_unit,
          buy_type: param.buy_type,
          type_code: param.type_code,
          classify_code: param.classify_code,
          component_code: param.component_code,
          hs_code:param.hs_code,
          nts_code:param.nts_code,
          description:param.description,
          company_uid:param.company,
          type_uid:param.type,
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
          item_modal_state.update(() => update_modal);
          item_form_state.update(()=>update_form);
          select_query('item');
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
        return common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/item/delete`
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
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              item_modal_state.update(() => update_modal);
              item_form_state.update(()=>update_form);

            
              select_query('item');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    



        }


     
     
        

       
    }




  
  }
  // const bomRowUtil = (title) => {
  //   if(title === 'add'){
  //     let new_id = update_form['child'].length + 1;
  //     let new_bom_data = {
       
  //       id : new_id,
  //       maker : update_form['maker'],
  //       code : '',
  //       name : '',
  //       unit : 'BOX',
  //       type : '완제품',
  //       check : false,
  //       use_qty : 0,

  //     };
  
  //     update_form['child'].push(new_bom_data);
  //   }else if(title === 'check_delete'){
  //     alert = {type : 'select', value : false}
      
  //     console.log('alert : ', alert);

 
  //     let delete_count = update_form['child'].filter(data => data.check === true).length;
  //     update_form['child'] = update_form['child'].filter(data => data.check === false) 



  //     console.log('child : ',delete_count);
  //     if(delete_count === 0 || delete_count === undefined){
  //       alert = {type : 'select', value : true}

  //       common_alert_state.update(() => alert);
       

  //     }

      
      

  //   }else {
  //     update_form['child'].pop();
  //   }
  
  //   item_form_state.update(() => update_form);
    
  // }


  // const bomRowCellClick = (title,id) => {
  //   if(title === 'check' ){
  //     for(let i =0; i<update_form['child'].length; i++){
  //       if(id === update_form['child'][i]['id']){
          
  //         update_form['child'][i][title] = !update_form['child'][i][title];
  //         break;
  //       }
  //     }
  
  //   }
    
  //   item_form_state.update(() => update_form);
    


  // }

  const itemExcelUpload = (e) => {
  
    const item_config : any = [
       {header: '품목코드', key: 'code', width: 30},
      {header: '약호', key: 'simple_code', width: 30},
      {header: '품목 한글명', key: 'ingr_kor_name', width: 30},
      {header: '품목 영문명', key: 'ingr_eng_name', width: 30},
      {header: '수불단위', key: 'inout_unit', width: 30},
      {header: '수불구분', key: 'inout_type', width: 30},
      {header: '화폐단위', key: 'currency_unit', width: 30},
      {header: '구매구분', key: 'buy_type', width: 30},
      {header: '품목분류', key: 'type_code', width: 30},
      {header: '유형코드', key: 'classify_code', width: 30},
      {header: '성분코드', key: 'component_code', width: 30},
      {header: 'HS코드', key: 'hs_code', width: 30},
      {header: '국세청코드', key: 'nts_code', width: 30},
      {header: '취급사 사업자번호', key: 'company_code', width: 30},
      {header: '품목구분', key: 'type_name', width: 30},
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
            for(let i=0; i<item_config.length; i++){
              obj[item_config[i].key] = row.values[i+1] !== '' ?  row.values[i+1] : "";

            }
            change_data.push(obj);
            
            item_upload_data = change_data;

          
          }else {

          }
          });

          console.log('item_upload_data',item_upload_data);

            const url = `${api}/item/excel_upload`
            try {
      
              let params = {
                data :  item_upload_data,
                
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
                select_query('item');
                return common_toast_state.update(() => toast);
      
              }else{
              
                return common_toast_state.update(() => TOAST_SAMPLE['fail']);
              }
            })
            }catch (e:any){
              return console.log('에러 : ',e);
            };
      
      
           
          



        
  

        })
      })

    }

  }

  const itemExcelFormDownload = () => {

    const data = [{

      code :  "J10002",
      simple_code :  "1,3-BG",
      ingr_kor_name :  "1,3-부틸렌 글리콘",
      ingr_eng_name :  "1,3-Butylene Glycol",
      inout_unit :  "Kg",
      inout_type :  "1",
      currency_unit :   "￥",
      buy_type :  "2",
      type_code :  "원자재",
      classify_code :  "110",
      component_code :  "H11",
      hs_code : "2905390000",
      nts_code : "nts-001",
      description : "Titanium Dioxide/Aluminium Oxide/Cobalt Aluminium Oxide Coated Mica",
      company_code : "900-00-00000",
      type_name : "샴푸",

    }
    
  ]; 
    const config : any = [
      {header: '품목코드', key: 'code', width: 30},
      {header: '약호', key: 'simple_code', width: 30},
      {header: '품목 한글명', key: 'ingr_kor_name', width: 30},
      {header: '품목 영문명', key: 'ingr_eng_name', width: 30},
      {header: '수불단위', key: 'inout_unit', width: 30},
      {header: '수불구분', key: 'inout_type', width: 30},
      {header: '화폐단위', key: 'currency_unit', width: 30},
      {header: '구매구분', key: 'buy_type', width: 30},
      {header: '품목분류', key: 'type_code', width: 30},
      {header: '유형코드', key: 'classify_code', width: 30},
      {header: '성분코드', key: 'component_code', width: 30},
      {header: 'HS코드', key: 'hs_code', width: 30},
      {header: '국세청코드', key: 'nts_code', width: 30},
      {header: '취급사 사업자번호', key: 'company_code', width: 30},
      {header: '품목구분', key: 'type_name', width: 30},
      {header: '비고', key: 'description', width: 30},
      
      
      
      
  
    
    
    ]; 


      try {

        let text_title : any= '품목 업로드 형식';
       

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


  







export {itemModalOpen,save,itemExcelUpload,itemExcelFormDownload,modalClose}