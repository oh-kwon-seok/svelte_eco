

//@ts-nocheck

import { writable } from 'svelte/store';
import {bom_modal_state,bom_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state,common_bom_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';
import Excel from 'exceljs';
const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;

let login_data : any;
let table_list_data : any;
let bom_data : any;
let bom_upload_data : any;
let selected_data : any;
let search_data : any;

const init_form_data:any = {
  uid : 0,
    company : '', // 사업장
    item : '', // 제품 OR 자재
    code : '', 
    name : '',
    description : '', // 사용자이름
    used : 1,


}


bom_modal_state.subscribe((data) => {
    update_modal = data;
})

bom_form_state.subscribe((data) => {
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
common_bom_state.subscribe((data) => {
  bom_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})


 

const makeCustomTable = (table_list_state,type,tableComponent,select) => {

       
  const url = `${api}/${type}/${select}`; 
  
  search_data['filter'] = TABLE_FILTER[type];
  
  common_search_state.update(() => search_data);
 let start_date= moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');
 let end_date= moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');;
 

 
 var tableDataNested = [
    {code:"Oli Bob",  _children:[
      {code:"Mary May"},
      {code:"Christine Lobowski"},
      {code:"Brendon Philips", _children:[
          {code:"Margret Marmajuke", },
          {code:"Frank Harbours",},
      ]},
  ]},

];
 
  let search_text = search_data['search_text'];
  let filter_title = search_data['filter_title'];


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
      
      console.log('res : ', res.data);
     
      if(res.data.length > 0){
       
        if(table_list_state[type]){
          table_list_state[type].destory();
        }

        
        table_list_data[type] =   new Tabulator(tableComponent, {
        dataTree : true,
        dataTreeStartExpanded:false,
     
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
              row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     

        data : tableDataNested,
      
        columns: TABLE_HEADER_CONFIG[type],
        
   
       
        });
       
        table_list_state.update(()=> table_list_data);

    
      
        
  }else{
    
    if(table_list_state[type]){
      table_list_state[type].destory();
    }

    table_list_data[type] =   new Tabulator(tableComponent, {
      dataTree : true,
      dataTreeStartExpanded:false,
      dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
      dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon
      dataTreeElementColumn:"code", //insert the collapse/expand toggle element 

      dataTreeBranchElement:"<i class='fa-light fa-l'></i>", //show image for branch element

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
            //row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;

          
                 
            

          },
   

      data : tableDataNested,
    
      columns: TABLE_HEADER_CONFIG[type],
      

      });
      
      table_list_state.update(()=> table_list_data);


 
  }
   })

  
}
 



const bomModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    bom_modal_state.update(() => update_modal);

   
    if(title === 'add'){
      update_form = init_form_data;
      bom_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){



        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            bom_form_state.update(() => update_form);
            bom_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      let data =  table_list_data['bom'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['bom']);
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
  bom_modal_state.update(() => update_modal);
  bom_form_state.update(() => update_form);
  


}



const save = (param,title) => {

  console.log('param : ', param);
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if(  param['company'] === '' || param['item'] === '' || param['code'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        bom_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/bom/save`
        try {
  
          
          let params = {
          
            company_uid : param.company,
            item : param.item,
            code  : param.code,
            
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
            bom_modal_state.update(() => update_modal);

            

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
      const url = `${api}/bom/update`
      
     
      
    
      try {

      
        let params = {
          uid : param.uid,
          company_uid : param.company,
          name : param.name,
          purpose : param.purpose,
          description : param.description,
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
          bom_modal_state.update(() => update_modal);
          update_form = init_form_data;
          bom_form_state.update(()=> update_form);
          select_query('bom');
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
          uid_array.push(data[i]['id']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/bom/delete`
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
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              bom_modal_state.update(() => update_modal);
              update_form = init_form_data;
              bom_form_state.update(()=> update_form);

              select_query('bom');
    
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


  const bomExcelUpload = (e) => {
  
    const config : any = [
      {header: '사업장', key: 'company_code', width: 30},
      {header: '품목코드', key: 'item_code', width: 30},
      {header: '부모코드', key: 'parent_code', width: 30},
      {header: '필요수량', key: 'qty', width: 30},
      {header: '비율', key: 'rate', width: 30},
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
            
            bom_upload_data = change_data;

          
          }else {

          }
          });

          return console.log('bom_upload_data',bom_upload_data);

          
  

        })

        const url = `${api}/bom/excel_upload`
        try {
  
          let params = {
            data :  bom_upload_data,
            
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
            select_query('bom');
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


  const bomExcelFormDownload = () => {

    const data = [{

      company_code : "1112223345",
      item_code : "B100-111-222",
      parent_uid : "A100-111-222",
      qty : 333,
      rate : 0.5,
     
    },{
      company_code : "3451112644",
      item_code : "B550-111-221",
      parent_uid : "A300-112-122",
      qty : 111,
      rate : 0.3,
    },
    
  ]; 


  
    const config : any = [
      {header: '사업장', key: 'company_code', width: 30},
      {header: '품목코드', key: 'item_code', width: 30},
      {header: '부모코드', key: 'parent_code', width: 30},
      {header: '필요수량', key: 'qty', width: 30},
      {header: '비율', key: 'rate', width: 30},
    
    
    ]; 


      try {

        let text_title : any= '생산레시피 업로드 형식';
       

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
          
          for(let loop = 1; loop <= 4; loop++) {
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





  





export {bomModalOpen,save,modalClose,bomExcelFormDownload,bomExcelUpload,makeCustomTable}