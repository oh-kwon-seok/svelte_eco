// @ts-nocheck


import { writable } from 'svelte/store';
import {common_alert_state,common_toast_state, menu_state,url_state,load_state,common_search_state,login_state,common_item_state,  common_company_state,common_user_state,table_list_state,common_company_filter_state,common_department_state,common_equipment_state, common_employment_state,common_type_state,common_bom_state,common_restric_material_state ,common_factory_state, common_factory_sub_state,common_factory_sub_filter_state} from './state';

// import {item_data,item_form_state} from '$lib/store/info/item/state';

import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';

import axios from 'axios';
import {v4 as uuid} from 'uuid';
import Excel from 'exceljs';
import moment from 'moment';


import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { removeCookie } from '$lib/cookies';

const api = import.meta.env.VITE_API_BASE_URL;
const client_url = import.meta.env.VITE_CLIENT_BASE_URL;



    
let alert_data : any;
let toast_data : any;
// let item_form_data : any;
let load_data : any;
let menu_data : any;
let search_data : any;
let list_data : any;
let login_data : any;
let url_data : any;
let table_data : any;
let table_list_data : any;

let item_data : any;
let bom_data : any;

let employment_data : any;
let department_data : any;


let company_data : any;
let company_filter_data : any;

let user_data : any;
let type_data : any;
let restric_material_data;

let factory_data : any;
let factory_sub_data : any;
let factory_sub_filter_data : any;
let equipment_data : any;
const workbook = new Excel.Workbook();



common_alert_state.subscribe((data : any) => {
  alert_data = data;
})

common_toast_state.subscribe((data : any) => {
  toast_data = data;
})

load_state.subscribe((data : any) => {
  load_data = data;
})

menu_state.subscribe((data : any) => {
  menu_data = data;
})

url_state.subscribe((data : any) => {
  url_data = data;
})
common_type_state.subscribe((data : any) => {
  type_data = data;
})

common_search_state.subscribe((data : any) => {
    search_data = data;
})

login_state.subscribe((data) => {
  login_data = data;

})

table_list_state.subscribe((data : any) => {
  table_list_data = data;
})


common_item_state.subscribe((data : any) => {
  item_data = data;
})

common_department_state.subscribe((data) => {
  department_data = data;

})
common_employment_state.subscribe((data) => {
  employment_data = data;

})
common_bom_state.subscribe((data) => {
  bom_data = data;

})




common_company_state.subscribe((data) => {
  company_data = data;

})
common_company_filter_state.subscribe((data) => {
  company_filter_data = data;

})

common_user_state.subscribe((data) => {
  user_data = data;

})
common_restric_material_state.subscribe((data) => {
  restric_material_data = data;

})
common_factory_sub_state.subscribe((data) => {
  factory_sub_data = data;
})

common_factory_sub_filter_state.subscribe((data) => {
  factory_sub_filter_data = data;
})

common_equipment_state.subscribe((data) => {
  equipment_data = data;
})
 
 




const init_login_data : any = {
  user_idx : "",
  id : "",
  name : "",
  password : "",
  token :"",

  status : false,
  
};


const handleSubmit = (e) => {
  e.preventDefault(); // 폼의 기본 동작 방지
  // 폼 제출에 대한 추가 로직을 이곳에 추가할 수 있습니다.
}


const infoCallApi = (title,select) => {

 
  const url = `${api}/${title}/${select}`; 
  
  const config = {
    headers:{
      "Content-Type": "application/json",
      
    }
  }

  try {
    axios.get(url,config).then(res=>{
   
  
      if(res.data.length > 0){
     if(title === 'user'){
          user_data = res.data;
          common_user_state.update(()=> user_data);
        
      }else if(title === 'company'){
          company_data = res.data;
          common_company_state.update(()=> company_data);
          if(company_data.length > 0){
            company_filter_data = company_data.filter(item => item.type === "사업장");
            common_company_filter_state.update(()=>company_filter_data);
          }
      }else if(title === 'employment'){
          employment_data = res.data;
     
          common_employment_state.update(()=> employment_data);
      }
      
      else if(title === 'factory'){
        factory_data = res.data;
    
        common_factory_state.update(()=> factory_data);

    } else if(title === 'factory_sub'){
      factory_sub_data = res.data;
      console.log('factory_sub_data   : ', res.data);
      common_factory_sub_state.update(()=> factory_sub_data);

    } else if(title === 'equipment'){
      equipment_data = res.data;
      
      console.log('equipment_data : ', equipment_data);
      common_equipment_state.update(()=> equipment_data);

    } 
    
    
    else if(title === 'department'){
          department_data = res.data;
          common_department_state.update(()=> department_data);
      }else if(title === 'type'){
        type_data = res.data;
      
        common_type_state.update(()=> type_data);
    } else if(title === 'restric_material'){
      restric_material_data = res.data;
      
      console.log('restric_material_data : ', restric_material_data);
      common_restric_material_state.update(()=> restric_material_data );
    } 
      }else {
      
      }
   })
  }catch(e){
    console.log('e',e);
  } finally {
    console.log('final : ');
  }
  }





  const logout = () => {
    var confirmLogout = confirm("로그아웃하시겠습니까?");

    if (confirmLogout) {
        // 여기에 로그아웃 로직을 추가하세요.
        login_data = init_login_data;
        removeCookie('my-cookie');
        removeCookie('password');
        removeCookie('autoSave');
      
        window.location.href = client_url;

        login_state.update(()=> login_data);
    
    } else {
        // 사용자가 '취소'를 선택한 경우
      
    }
    }






const changeUrl = (obj) => {
  
  
  
  url_data['path'] =obj['path'];
  url_data['query'] =obj['query'];

  
  url_state.update(()=> url_data);


  }



  const commonCloseAlert = (state) => {
   
    alert_data = {type : state, value : false} 

    
    common_alert_state.update(()=> alert_data);
  
    }

    const commonCloseToast = (state) => {
   
      toast_data = {type : state, value : false, counter : 4} 
  
      
      common_toast_state.update(()=> toast_data);
    
      }




const onChangeHandler = (e) => {
  let title = e.target.name;
  login_data[title] = e.target.value;
  login_state.update(()=> login_data);

  }
  const tokenChange = (token) => {
    
    login_data['token'] = token;
    login_state.update(()=> login_data);
  
    }


  const handleToggle = (title) => {
   
    
    menu_data[title] = !menu_data[title];
    menu_state.update(()=> menu_data);
  
    
    }


    const loadChange = (param) => {
      load_data = param;
      load_state.update(()=> load_data);
      
    }
const onSearchHandler = (e : any) => { 

    search_data['search_text'] = e.target.value;
    
    // if(search_data['type'] === 'all'){
    //   search_data['filteredItems'] = list_data.filter((item) => item['maker'].indexOf(search_data['search_text'].toLowerCase()) !== -1 || item['name'].indexOf(search_data['search_text'].toLowerCase()) !== -1)
    // }else {
    //   search_data['filteredItems'] = list_data.filter((item) => item[search_data['type']].indexOf(search_data['search_text'].toLowerCase()) !== -1);
    // }
    
    
    common_search_state.update(()=> search_data);
   
}


const cellClick = (data, key,value) => {
      
  if(key === 'expand' || key === 'check' ){
    for(let i =0; i<data.length; i++){
      if(value === data[i].code){
        
        data[i][key] = !data[i][key];
        break;
      }
    }

  }
  
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const rowClick = (data, key,value) => {
      
  if(key === 'select' ){
    for(let i =0; i<data.length; i++){
      if(data[i]['select'] === true){
        data[i][key] = !data[i][key];

      }
      if(value === data[i].code){
        
        data[i][key] = !data[i][key];
       
      }
    }

  }
  
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const allCheckClick = (data, key,value) => {
      
  if(key === 'check'){
    for(let i =0; i<data.length; i++){
        data[i][key] = !value;
    }
  }
  
  search_data['all_check'] = !value;
  search_data['filteredItems'] = data;
  common_search_state.update(()=> search_data);
}

const check_delete = (data, key,value) => {
      
  let setData = data.filter(item => item.check === false);


  search_data['filteredItems'] = setData;
   search_data['all_check'] = false;
  common_search_state.update(()=> search_data);
}




const excelDownload = (type,config) => {
  
  let data =  table_list_data[type].getSelectedData();
  console.log('data  : ', table_list_data[type].getSelectedData());
  
  
  
  if(data.length > 0){
    // 모든 객체에서 공통된 키(key) 이름을 찾기 위한 반복문
    for (let i = 0; i <  data.length; i++) {
      let currentObject =  data[i];

      Object.keys(currentObject).map((key)=> {    

        if(typeof currentObject[key] === 'object' && currentObject[key] !== null){
        
          data[i][key] = currentObject[key]['name'];
        }

        // console.log(typeof currentObject[key], key,currentObject[key]);

        // if(typeof currentObject[key] === "object"){
        //   console.log('currentObject : ',currentObject[key]);
        //   data[i][key] = currentObject[key]['name'];
        // }
      
      }); 
    }

    try {

      let text_title : any= '';
      switch(type){
          case 'item': 
              text_title = '품목 관리';
          break;
          case 'company': 
              text_title = '거래처 관리';
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



  const fileButtonClick = (id) => {

    try {
      let myInput : any = document.getElementById(id);
      myInput.click();
    } catch(error) {
      console.error(error);
    }
  }

 


  const excelUpload = (e,config) => {
    
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
            console.log(row.values, rowIndex);
            if(rowIndex > 1){
            let obj = {

            };
            for(let i=0; i<config.length; i++){
              obj[config[i].key] = row.values[i+1];

            }
            obj['expand'] = false;
            obj['check'] = false;
            change_data.push(obj);

            list_data = change_data;
          }else {

          }
           

           

          
          });
          // item_data.update(() => list_data);
          search_data['filteredItems'] = list_data;
          common_search_state.update(() => search_data);
          
       

        })
      })
     
    }
   
  }

  const minMaxFilterFunction = (headerValue, rowValue, rowData, filterParams) => {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property
    
        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }
    
    return true; //must return a boolean, true if it passes the filter.
    }


      const minMaxFilterEditor = (cell, onRendered, success, cancel, editorParams) =>{

      var end;
      
      var container = document.createElement("span");
      
      //create and style inputs
      var start = document.createElement("input");
      start.setAttribute("type", "number");
      start.setAttribute("placeholder", "Min");
      start.setAttribute("min", 0);
      start.setAttribute("max", 100);
      start.style.padding = "4px";
      start.style.width = "50%";
      start.style.boxSizing = "border-box";
      
      start.value = cell.getValue();
      
      function buildValues(){
          success({
              start:start.value,
              end:end.value,
          });
      }
      
      function keypress(e){
          if(e.keyCode == 13){
              buildValues();
          }
      
          if(e.keyCode == 27){
              cancel();
          }
      }
      
      end = start.cloneNode();
      end.setAttribute("placeholder", "Max");
      
      start.addEventListener("change", buildValues);
      start.addEventListener("blur", buildValues);
      start.addEventListener("keydown", keypress);
      
      end.addEventListener("change", buildValues);
      end.addEventListener("blur", buildValues);
      end.addEventListener("keydown", keypress);
      
      
      container.appendChild(start);
      container.appendChild(end);
      
      return container;
      }



      const select_query = (type) => {
   
        const url = `${api}/${type}/select`; 
              
        search_data['filter'] = TABLE_FILTER[type];
        
        common_search_state.update(() => search_data);

        let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

        let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');
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
              console.log('resData : ', res.data);
            table_list_data[type].setData(res.data);
            table_list_state.update(() => table_list_data);
           
         })
      
      }


      const makeCustomTable = (table_list_state,type,tableComponent,select) => {

       
        const url = `${api}/${type}/${select}`; 
        
        search_data['filter'] = TABLE_FILTER[type];
        
        common_search_state.update(() => search_data);
      //  let start_date= moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');
      //  let end_date= moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');;
       
      
       
       
        let search_text = search_data['search_text'];
        let filter_title = search_data['filter_title'];
      

        let params = 
        {
     
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


    const selectCustomQuery = (type,select) => {
   
      const url = `${api}/${type}/${select}`; 

            
      search_data['filter'] = TABLE_FILTER[type];
      
      common_search_state.update(() => search_data);

      let start_date = moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');

      let end_date = moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');

      
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
          
          table_list_data[type].setData(res.data);
          table_list_state.update(() => table_list_data);
         
       })
    
    }







   


export {handleToggle, 
  onChangeHandler, 
  onSearchHandler,
  excelDownload,
  excelUpload,
  fileButtonClick, 
  allCheckClick, 
  cellClick, 
  rowClick, 
  check_delete, 
  changeUrl,
  loadChange,
  commonCloseAlert,
  commonCloseToast,
  infoCallApi,
  minMaxFilterFunction,
  minMaxFilterEditor,
  makeCustomTable,
  tokenChange,
  select_query,
  selectCustomQuery,
  logout,
  handleSubmit,
 
}