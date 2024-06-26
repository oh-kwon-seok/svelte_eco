

//@ts-nocheck

import { writable } from 'svelte/store';
import {bom_modal_state,bom_form_state} from './state';
import {item_modal_state} from '$lib/store/item/state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,table_modal_state,common_selected_state,common_bom_state} from '$lib/store/common/state';
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
let bom_data : any;
let bom_upload_data : any;
let selected_data : any;
let search_data : any;
let item_modal : any;


const init_form_data:any = {
  uid : 0,
    company : '', // 사업장
    item : '', // 제품 OR 자재
    code : '', 
    name : '',
    qty : 1,
    rate : 1,
    _children : [], // 서브데이터
    description : '', // 사용자이름
    used : 1,


}

let init_bom_uid :any ;
let selected_bom_sub_data :any ;


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
table_modal_state.subscribe((data) => {
  table_modal_data = data;
})
common_bom_state.subscribe((data) => {
  bom_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

item_modal_state.subscribe((data) => {
  item_modal = data;
})


 

const makeCustomTable = (table_list_state,type,tableComponent,select) => {

       
  const url = `${api}/${type}/${select}`; 
  
  search_data['filter'] = TABLE_FILTER[type];
  
  common_search_state.update(() => search_data);
 let start_date= moment(search_data['start_date']).format('YYYY-MM-DDTHH:mm:ss');
 let end_date= moment(search_data['end_date']).format('YYYY-MM-DDTHH:mm:ss');;
 

 
 var tableDataNested = [
    {code:"인디안밥",  _children:[
      {code:"인디안밥"},
      {code:"인디안밥"},
      {code:"양념", _children:[
          {code:"시즈닝", },
          {code:"소금",},
      ]},
  ]},
  {code:"인디안밥",_children:[
    {code:"밥"},
    {code:"밥1"},
    {code:"양념", _children:[
        {code:"시즈닝", },
        {code:"소금",},
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
      console.log('params : ',params);
      
     
      if(res.data.length > 0){
        let data = res.data;
              let map = {};
              data.forEach(item => {
                map[item.uid] = item;
              });

              console.log('map : ', map);

      // _children 속성을 추가할 요소들을 담을 배열 초기화
      let result = [];

      // 주어진 배열을 순회하면서 _children 속성을 추가할 요소들을 처리
      data.forEach(item => {
        if (item.parent_uid !== 0) {
          // parent_uid가 0이 아닌 경우
          let parent = map[item.parent_uid];
          if (parent) {
            // 부모 요소를 찾은 경우
            if (!parent._children) {
              // _children 속성이 없는 경우 초기화
              parent._children = [];
            }
            // 현재 요소를 부모 요소의 _children 속성에 추가
            parent._children.push(item);
          }
        } else {
          // parent_uid가 0인 경우
          result.push(item);
        }
      });

      

       
        if(table_list_state[type]){
          table_list_state[type].destory();
        }

        
        table_list_data[type] =   new Tabulator(tableComponent, {
          dataTree : true,
          dataTreeStartExpanded:false,
          //movableRows:true,
    
          // dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
          // dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon

          dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
          dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon

          dataTreeElementColumn:"code", //insert the collapse/expand toggle element 
         
         
      
          dataTreeBranchElement:"<i style='font-size:0.7em; margin-left : 5px; padding-right:2px;' class='fas fa-l'></i>", //show image for branch element
    
     
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
     

        data : result,
      
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
      // movableRows:true,

      // dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
      // dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon
      dataTreeElementColumn:"code", //insert the collapse/expand toggle element 
     
     
  
      //dataTreeBranchElement:"<i style='font-size:0.7em; vertical-align : top; margin-right : 5px;' class='fas fa-l'></i>", //show image for branch element

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
   

      data : [],
    
      columns: TABLE_HEADER_CONFIG[type],
      

      });
      
      table_list_state.update(()=> table_list_data);


 
  }
   })

  
}


const bomModalTable = (table_modal_state,type,tableComponent,select,title) => {

  
  
  if(title === 'add'){
    
          if(table_modal_state[type]){
            table_modal_state[type].destory();
          }
  
          table_modal_data[type] =   new Tabulator(tableComponent, {
            dataTree : true,
            dataTreeStartExpanded:true,
            movableRows:true,
            dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
            dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon
            dataTreeElementColumn:"code", //insert the collapse/expand toggle element 
          
             dataTreeBranchElement:"<i style='font-size:0.7em; margin-left : 5px; padding-right:2px;' class='fas fa-l'></i>", //show image for branch element
    
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
          table_modal_state.update(()=> table_modal_data);
  
      
        
          
    }else if(title === 'update'){

     
      if(table_modal_state[type]){
        table_modal_state[type].destory();
      }

      table_modal_data[type] =   new Tabulator(tableComponent, {
        dataTree : true,
        dataTreeStartExpanded:true,
        movableRows:true,
        dataTreeCollapseElement:"<i class='fas fa-minus-square'></i>", //fontawesome toggle icon
        dataTreeExpandElement:"<i class='fas fa-plus-square'></i>", //fontawesome toggle icon
        dataTreeElementColumn:"code", //insert the collapse/expand toggle element 
        
        dataTreeBranchElement:"<i style='font-size:0.7em; margin-left : 5px; padding-right:2px;' class='fas fa-l'></i>", //show image for branch element
    
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
   

      data : update_form['_children'].length > 0 ? update_form['_children'] : [],
      placeholder:"데이터 없음",
      columns: MODAL_TABLE_HEADER_CONFIG[type],
      
      });

    
      table_modal_state.update(()=> table_modal_data);

   

  }


  
}



const bomAddRow = () => {


 


  let company_uid = getCookie('company_uid');


  
  let data = table_modal_data['bom'].getData();

  console.log('data : ', data);
  
  let new_obj = {
    title : 'main',

    uid : parseInt(data.length) + 1, 
    parent_uid : update_form['item'],
    company_uid : company_uid,
    item_uid : 0,
    code : '',
    qty : 1,
    rate : 1,
    used : 1,
  }
  
  data.push(new_obj);

  table_modal_data['bom'].setData(data);


  table_modal_state.update(()=> table_modal_data);
}




const bomDeleteRow = () => {
  // console.log('눌림');
  let data = table_modal_data['bom'].getData();
  
  data.pop();
  table_modal_data['bom'].setData(data);
  table_modal_state.update(()=> table_modal_data);

}
const bomAllDeleteRow = () => {
 

  table_modal_data['bom'].setData([]);

  table_modal_state.update(()=> table_modal_data);

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

      console.log('data : ', data);
      console.log('data : ', data._children);
      
      console.log('table_modal_data'),table_modal_data['bom'];

        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'item'){
              update_form[item] = data[item]['uid'];
             
              console.log('item : ',  update_form[item]);
              console.log('data.item : ', data[item]);
              
            }else if(item === '_children'){
              if(data._children){

                for(let i =0; i<data._children.length; i++){
                  data._children[i]['company_uid'] = data._children[i]['company']['uid'];
                  data._children[i]['parent_uid'] = data['item']['uid'];
                  data._children[i]['item_uid'] = data._children[i]['item']['uid'];
                  data._children[i]['title'] = 'main';

                  if(data._children[i]['_children']){
                    for(let j=0; j<data._children[i]['_children'].length; j++){
                      data._children[i]['_children'][j]['company_uid'] = data._children[i]['_children'][j]['company']['uid'];
                      data._children[i]['_children'][j]['parent_uid'] = data._children[i]['item']['uid'];
                      data._children[i]['_children'][j]['item_uid'] = data._children[i]['_children'][j]['item']['uid'];
                      
                      data._children[i]['_children'][j]['title'] = 'sub';


                      if(data._children[i]['_children'][j]['_children']){
                        for(let z=0; z<data._children[i]['_children'][j]['_children'].length; z++){
                          data._children[i]['_children'][j]['_children'][z]['company_uid'] = data._children[i]['_children'][j]['_children'][z]['company']['uid'];
                          data._children[i]['_children'][j]['_children'][z]['parent_uid'] = data._children[i]['_children'][j]['item']['uid'];
                          data._children[i]['_children'][j]['_children'][z]['item_uid'] = data._children[i]['_children'][j]['_children'][z]['item']['uid'];
                          
                          
                          data._children[i]['_children'][j]['title'] = 'sub';
                          
                          if(data._children[i]['_children'][j]['_children'][z]['_children']){
                            for(let x=0; x<data._children[i]['_children'][j]['_children'][z]['_children'].length; x++){
                              
                              
                              data._children[i]['_children'][j]['_children'][z]['_children'][x]['company_uid'] = data._children[i]['_children'][j]['_children'][z]['_children'][x]['company']['uid'];
                              data._children[i]['_children'][j]['_children'][z]['_children'][x]['parent_uid'] = data._children[i]['_children'][j]['_children'][z]['item']['uid'];
                              data._children[i]['_children'][j]['_children'][z]['_children'][x]['item_uid'] = data._children[i]['_children'][j]['_children'][z]['_children'][x]['item']['uid'];
                              
                              
                              data._children[i]['_children'][j]['title'] = 'sub';
                              
                            
                            
                            }
                          }
                        
                        
                        }
                      }

                    }

                  }


                }

                update_form[item] = data._children;
              }else {
                update_form[item] = [];
              }
            }
            else{
              update_form[item] = data[item];
              console.log('update_form', update_form[item]);
              console.log('data[item0]', data[item]);
            }
           
        }); 

        
          console.log('update_form : ', update_form);
      
            bom_form_state.update(() => update_form);
            bom_modal_state.update(() => update_modal);
           

    }
    if(title === 'check_delete'){
      let data =  table_list_data['bom'].getSelectedData();

      common_selected_state.update(() => data);
    
  }
}



const itemSearchModalOpen = (title : any) => {

   
     alert['type'] = 'save';
     alert['value'] = false;
     console.log('titme : ', title);
     common_alert_state.update(() => alert);
     item_modal['title'] = title;
     item_modal[title]['use'] = true;
     item_modal[title]['title'] = title;

     
   
     item_modal_state.update(() => item_modal);
 
 }

 const bomSearchModalOpen = (title : any, data:any) => {

  console.log('data : ', data);
  init_bom_uid = data.getData();
   

  alert['type'] = 'save';
  alert['value'] = false;
  console.log('titme : ', title);
  common_alert_state.update(() => alert);
  item_modal['title'] = title;
  item_modal[title]['use'] = true;
  item_modal[title]['title'] = title;

  

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
  
              columns: title === 'search' ? MODAL_TABLE_HEADER_CONFIG[type] : MODAL_TABLE_HEADER_CONFIG['bom_search'],
              
         
             
              });
              table_modal_state.update(()=> table_modal_data);
           
    }
  })
        
}



const bomSubAddRow = (row,cell:any) => {

  console.log('row  :', row);
  let company_uid = getCookie('company_uid');

  let new_obj;

  if(row.item_uid === 0){
    window.alert('품목을 선택해주십시오.');
  
  }else{
    if (!row._children) {
      // _children 속성이 없으면 빈배열 할당
      row._children = [];    
    } else {
      // 있으면 아무것도 안함
   
    }
      new_obj = {
        uid : row.item_uid + "-" + parseInt(row._children.length) + 1, 
        title : 'sub',
        company_uid : company_uid,
        item_uid : 0,
        parent_uid : row.item_uid,
        code : '',
        qty : 1,
        rate : 1,
        used : 1,
      }

      // 새로운 {}를 _children 배열에 추가
      row._children.push(new_obj);
      selected_bom_sub_data = row;

      cell.getRow().update(row);

      let final_data = table_modal_data['bom'].getData();

      table_modal_data['bom'].setData(final_data)
      table_modal_state.update(()=> table_modal_data);

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

  if(table_modal_data['bom']){
    table_modal_data['bom'].destroy();
    table_modal_state.update(()=> table_modal_data)

  }
  bom_modal_state.update(() => update_modal);
  bom_form_state.update(() => update_form);
  


}

const itemSearchmodalClose = (title) => {
  item_modal['title'] = '';
  item_modal[title]['use'] = !item_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;

  common_alert_state.update(() => alert);
  item_modal_state.update(() => item_modal);
 

}
const itemSelect = (row) => {
  

  update_form['item'] = row.uid;
  update_form['code'] = row.code;
  
  item_modal['search']['use'] = !item_modal['search']['use'];

  item_modal_state.update(() => item_modal);
  bom_form_state.update(()=> update_form);
  
}

const bomSelect = (row) => {
   

  

  let new_data = row.getRow().getData();
  
  console.log('bomSelect  :',init_bom_uid);
  console.log('item : ', update_form['item']);
  
  
  let checkData ; 

  if(init_bom_uid.title === 'main'){
    console.log(update_form['item']);
  
    console.log(new_data.parent_uid);
   


    if(update_form['item'] === new_data['uid']){
      return window.alert('메인 BOM에 존재하는 품목입니다.');
    }else{
      checkData = table_modal_data['bom'].getData().find(item => item['item_uid'] === new_data['uid']);
      console.log('checkData : ', checkData);
    }   
  }else{
  
    if(update_form['item'] === new_data['uid']){
    
      return window.alert('메인 BOM에 존재하는 품목입니다.');
    
    }else{
      console.log('selected_bom_sub_Data',selected_bom_sub_data);

      if(selected_bom_sub_data['item_uid'] === new_data['uid']){
        return window.alert('상위 BOM에 존재하는 품목입니다.');
      }else{
        checkData = selected_bom_sub_data['_children'].find(item => item['item_uid'] === new_data['uid']);
  
      }

     
    }
  }
 
  
  if(checkData){
    return window.alert('BOM 목록에 존재하는 품목입니다.');
    

  }else{
   

    init_bom_uid.item_uid = new_data.uid;
    init_bom_uid.name = new_data.code;
    init_bom_uid.code = new_data.code;
    
    

    row.getRow().update(init_bom_uid);

    let final_data = table_modal_data['bom'].getData();

    table_modal_data['bom'].setData(final_data)

    table_modal_state.update(()=> table_modal_data);

    item_modal['bom_search']['use'] = !item_modal['bom_search']['use'];
    item_modal_state.update(() => item_modal);
  
  }
}


const bomSelectDelete = (row) => {
   // 보완해야함
  let deleteCheck = confirm("정말로 삭제하시겠습니까?");

  
  if(deleteCheck){

 
    let new_data = row.getData();
    let filterd_data;
    
    console.log('filterd_data : ', new_data);

    if(new_data.title === 'main'){
       filterd_data = table_modal_data['bom'].getData().filter((item) => {
        return item.uid !== new_data.uid;
      })
      console.log('filterd_data : ', filterd_data);
      table_modal_data['bom'].setData(filterd_data);

    }else{
     
      let data = table_modal_data['bom'].getData();
      let checkData = data.find(item => item['item_uid'] === new_data['parent_uid']);
      let filterd_data;
      let final_data;

      console.log('checkData : ', checkData);
      if(checkData){
       
          final_data = checkData['_children'].find(item => item['uid'] === new_data['uid']);

         

          if (final_data && Object.keys(final_data).length === 0 && final_data.constructor === Object) {
            // final_data가 비어 있는 객체인 경우
            console.log('final_data는 비어 있는 객체입니다.');
          } else {
            filterd_data = checkData['_children'].filter((item) => {
              return item.uid !== new_data['uid'];
            })

           
            for(let i =0 ; i< data.length; i++){
              if(data[i]['item_uid'] === final_data['parent_uid']){
                data[i]['_children'] =  filterd_data;
              }
            }

            table_modal_data['bom'].setData(data);



  
          }
         
        
      }else{

        // 첫번째 하위품목에서 bom을 못찾았을 떄 아래로 계속진행
        for(let i =0 ; i< data.length; i++){

          console.log('data : ', data[i]);
          if (data[i]['_children']) { // 자식속성이 있는 경우
            let checkData = data[i]['_children'].find(item => item['item_uid'] === new_data['parent_uid']);
           
            console.log('checkData : ', checkData);
         
            
            if(checkData){ // 찾았으면
              final_data = checkData['_children'].find(item => item['uid'] === new_data['uid']);


              if (final_data && Object.keys(final_data).length === 0 && final_data.constructor === Object) {
                // final_data가 비어 있는 객체인 경우
                console.log('final_data는 비어 있는 객체입니다.');
              } else {
                filterd_data = checkData['_children'].filter((item) => {
                  return item.uid !== new_data['uid'];
                })

           

             
                   for(let j =0 ; j< data[i]['_children'].length; j++){
                
                    for(let z=0; z<data[i]['_children'][j]['_children'].length; z++){

                      console.log(data[i]['_children'][j]['_children'][z]['item_uid']);
                      // console.log(checkData['_children']['parent_uid']);
                          if(data[i]['_children'][j]['_children'][z]['item_uid'] === checkData['_children'][j]['item_uid']){
                          data[i]['_children'][j]['_children'] =  filterd_data;
                        }
                      }
                  }
                table_modal_data['bom'].setData(data);
              }
            }else{

              for(let j=0; j< data[i]['_children'].length; j++){
                
                if(data[i]['_children'][j]['_children']){
                  
                  let checkData = data[i]['_children'][j]['_children'].find(item => item['item_uid'] === new_data['parent_uid']);

                  console.log('checkData : ', checkData);
                  console.log('newData : ', new_data);

                  if(checkData){ // 찾았으면
                    
                    final_data = checkData['_children'].find(item => item['uid'] === new_data['uid']);
                    if (final_data && Object.keys(final_data).length === 0 && final_data.constructor === Object) {
                      // final_data가 비어 있는 객체인 경우
                      console.log('final_data는 비어 있는 객체입니다.');
                    } else {
                      filterd_data = checkData['_children'].filter((item) => {
                        return item.uid !== new_data['uid'];
                      })
                      console.log('filterd_data : ', filterd_data);
                      for(let z =0 ; z< data[i]['_children'][j]['_children'].length; z++){
                        console.log('data : ', new_data);
                        console.log('data : ', checkData['_children'][z]['item_uid']);
                        console.log('hihi : ', data[i]['_children'][j]['_children'][z]['item_uid']);
                        
                        if(data[i]['_children'][j]['_children'][z]['item_uid'] === checkData['_children'][z]['parent_uid']){
                          data[i]['_children'][j]['_children'][z]['_children'] =  filterd_data;
                        }
                      }

                      
                      console.log('data',data);
                    table_modal_data['bom'].setData(data);




                  }


                }
             
              
                
              
              }

              
            }

            }

          
          }else{
            window.alert('bom은 4단계까지만 지원됩니다.');

          }

          // if(data[i]['item_uid'] === checkData['parent_uid']){
          //   data[i]['_children'] =  filterd_data;
          // }
        }
      }
    }



      table_modal_state.update(()=> table_modal_data);

  }else{

  }

 

  }




const save = (param,title) => {

  console.log('param : ', param);
  param['company'] = getCookie('company_uid')

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
        let data = table_modal_data['bom'].getData();
        let sub_data = [];
        for(let i =0 ; i< data.length; i++){
          
          if (data[i]['_children']) { // 자식속성이 있는 경우
            for(let j=0; j<data[i]['_children'].length; j++){ 
              console.log('uid : ', data[i]['_children'][j]['item_uid'])
              if(data[i]['_children'][j]['item_uid'] !== 0){
                sub_data.push(data[i]['_children'][j]);
              }

              if(data[i]['_children'][j]['_children']){

                for(let z=0; z<data[i]['_children'][j]['_children'].length; z++){

                  if(data[i]['_children'][j]['_children'][z]['item_uid'] !== 0){
                    sub_data.push(data[i]['_children'][j]['_children'][z]);
                  }
                }

              }

              
           


            }

          }
        }
        let final_data = data.concat(sub_data).filter(item => {
            parseFloat(item['qty']); 
            parseFloat(item['rate']); 
            
        
          return item['qty'] > 0 && item['qty'] !== undefined && item['rate'] > 0 && item['rate'] !== undefined
        });

      

        console.log('final_data : ', final_data);
       
        const url = `${api}/bom/save`
        try {
  
          
          let params = {
          
            company_uid : parseInt(param['company']),
            item_uid : param.item,
            code  : param.code,
            qty : parseFloat(param.qty),
            rate : parseFloat(param.rate),
            bom_data : final_data,
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
            bom_modal_state.update(() => update_modal);

            

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
      
      let data = table_modal_data['bom'].getData();
      
      let sub_data = [];
      for(let i =0 ; i< data.length; i++){
          
        if (data[i]['_children']) { // 자식속성이 있는 경우
          for(let j=0; j<data[i]['_children'].length; j++){ 
            console.log('uid : ', data[i]['_children'][j]['item_uid'])
            if(data[i]['_children'][j]['item_uid'] !== 0){
              sub_data.push(data[i]['_children'][j]);
            }

            if(data[i]['_children'][j]['_children']){

              for(let z=0; z<data[i]['_children'][j]['_children'].length; z++){

                if(data[i]['_children'][j]['_children'][z]['item_uid'] !== 0){
                  sub_data.push(data[i]['_children'][j]['_children'][z]);
                }

                if(data[i]['_children'][j]['_children'][z]['_children']){
                  for(let x=0; x<data[i]['_children'][j]['_children'][z]['_children'].length; x++){
  
                    if(data[i]['_children'][j]['_children'][z]['_children'][x]['item_uid'] !== 0){
                      sub_data.push(data[i]['_children'][j]['_children'][z]['_children'][x]);
                    }
  
  
                  }
  
  
                }


              }

           

            }
          }

        }
      }
      let final_data = data.concat(sub_data).filter(item => {
        parseFloat(item['qty']); 
        parseFloat(item['rate']); 
        
    
      return item['qty'] > 0 && item['qty'] !== undefined && item['rate'] > 0 && item['rate'] !== undefined
    });


      const url = `${api}/bom/update`
      

     
      
    
      try {

      
        let params = {
          uid : param.uid,
          company_uid : parseInt(param['company']),
          item_uid : param.item,
          code  : param.code,
          qty : parseFloat(param.qty),
          rate : parseFloat(param.rate),
          bom_data : final_data,
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


      console.log('data : ', data);
    
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        return common_alert_state.update(() => alert);

      }else{
        // for(let i=0; i<data.length; i++){
          
          
        //   uid_array.push(data[i]['id']);
        // }
      }

        if(data.length > 0){

          const url = `${api}/bom/delete`
          try {
    
            let params = {
  
              data : data,
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
  
    let company_uid = getCookie('company_uid');
    const config : any = [
      {header: 'BOM(품목)코드', key: 'item_code', width: 30},
      {header: '메인코드', key: 'main_code', width: 30},
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

        
          
  

        })
     
          
        console.log('bom_upload_data',bom_upload_data);
        for(let i= 0; i<bom_upload_data.length; i++){
          bom_upload_data[i]['company'] = company_uid;
          
        }
        
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
            //select_query('bom');
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
      item_code : "A100-100-111",
      main_code : "",
      parent_code : "",
      qty : 1,
      rate : 0.5,
     
    },{
      item_code : "B100-100-111",
      main_code : "A100-100-111",
      parent_code : "A100-100-111",
      qty : 0.33,
      rate : 0.3,
    },
    {
      item_code : "C100-100-111",
      main_code : "A100-100-111",
      parent_code : "B100-100-111",
      qty : 11,
      rate : 0.3,
    },
    
  ]; 


  
    const config : any = [
      {header: 'BOM(품목)코드', key: 'item_code', width: 30},
      {header: '메인코드', key: 'main_code', width: 30},
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





  





export {bomModalOpen,save,modalClose,bomExcelFormDownload,bomExcelUpload,makeCustomTable,itemSearchTable,itemSearchModalOpen,itemSearchmodalClose,itemSelect,bomModalTable,bomAddRow,bomSelect,bomSearchModalOpen,bomDeleteRow,bomAllDeleteRow,bomSelectDelete,bomSubAddRow}