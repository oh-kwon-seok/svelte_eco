//@ts-nocheck
import { DateTime } from 'luxon';


import {item_modal_state} from '$lib/store/item/state';




import {itemModalOpen} from '$lib/store/item/function';


import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from '$lib/module/common/function';

import { bomSelect, workPlanModalOpen} from '$lib/store/work_plan/function';

import { workPlanSelect, workTaskModalOpen} from '$lib/store/work_task/function';

import moment from 'moment';

import axios from 'axios'




const TABLE_FILTER : any = {
   
    work_plan : [
        {value : "all",name : "전체"},
        {value : "uid", name : "제품명"},        
    ],
    work_task : [
        {value : "all",name : "전체"},
      
    ],
   
}





const EXCEL_CONFIG : any = {
   
      
        // order : [
        //     {header: '주문코드', key: 'code', width: 30},
        //     {header: '주문명', key: 'name', width: 30},
        //     {header: '용도', key: 'status', width: 30},
        //     {header: '비고', key: 'description', width: 30},
              
        // ],
    
    
}; 



const MODAL_TABLE_HEADER_CONFIG : any = {
    work_plan_bom_search : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"품목구분", field:"type.name", width:150, headerFilter:"input"},

        {title:"코드", field:"code", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                bomSelect(row.getData());
            }else{
                
            }
            }
        },
        {title:"취급사", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
    work_task_work_plan_search : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"품목구분", field:"type.name", width:150, headerFilter:"input"},

        {title:"코드", field:"code", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                workPlanSelect(row.getData());
            }else{
                
            }
            }
        },
        {title:"취급사", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
   

    

}
const TABLE_HEADER_CONFIG : any = {
  

 
    work_plan: [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"제품명", field:"bom.code", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                workPlanModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        {title:"계획수량", field:"qty", width:150, headerFilter:"input",
        
         formatter:function(cell : any){
            var value = cell.getValue();
            return "<span>" + commaNumber(value) + "</span>";
            },
            bottomCalc:"sum", 
            bottomCalcFormatter:function(cell : any){
                var value = cell.getValue();
            return commaNumber(value);
             },

        },
        
        {title:"단위", field:"unit", width:150, headerFilter:"input"},
        
        
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],

    work_task: [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        
        {title:"제품명", field:"bom.code", width:300, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                workTaskModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        {title:"지시수량", field:"task_qty", width:150, headerFilter:"input",
        
         formatter:function(cell : any){
            var value = cell.getValue();
            return "<span>" + commaNumber(value) + "</span>";
            },
            bottomCalc:"sum", 
            bottomCalcFormatter:function(cell : any){
                var value = cell.getValue();
            return commaNumber(value);
             },

        },
        
        {title:"단위", field:"unit", width:150, headerFilter:"input"},
        {title:"자재출고구분", field:"material_order", width:150, headerFilter:"input",
        
         formatter:function(cell : any){
            var value = cell.getValue();
         if(value === 0){
                value = '자재출고반려';
         }else if(value === 1){
                value = '자재출고요청완료';

            }else if(value === 2){
                value = '자재출고승인완료';
            }
            return "<span style='font-weight:bold;'>" + value + "</span>";
            },
        },
        
   
       {title:"계량구분", field:"measure_order", width:150, headerFilter:"input",
        
       formatter:function(cell : any){
          var value = cell.getValue();
        
          if(value === 0){
              value = '계량지시대기'
          }
          else if(value === 1){
              value = '계량지시'
          }else if(value === 2){
            value = '계량완료'
        }
          return "<span style='font-weight:bold;'>" + value + "</span>";
          },
      },{title:"제조구분", field:"measure_order", width:150, headerFilter:"input",
        
      formatter:function(cell : any){
         var value = cell.getValue();
       
         if(value === 0){
             value = '제조지시대기'
         }
         else if(value === 1){
             value = '제조지시'
         }else if(value === 2){
           value = '제조완료'
       }
         return "<span style='font-weight:bold;'>" + value + "</span>";
         },
     },
     ,{title:"포장구분", field:"packing_order", width:150, headerFilter:"input",
        
      formatter:function(cell : any){
         var value = cell.getValue();
       
         if(value === 0){
             value = '포장지시대기'
         }
         else if(value === 1){
             value = '포장지시'
         }else if(value === 2){
           value = '포장완료'
       }
         return "<span style='font-weight:bold;'>" + value + "</span>";
         },
     },
        
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],


}




const TABLE_TOTAL_CONFIG : any = {
    //layout: "fitDataTable",
    layout:"fitData",
    
    pagination:"local",
  
    paginationSize:20,
    paginationSizeSelector:[10,50,100,500,5000],

    movableColumns:true,
    paginationCounter:"rows",
    paginationAddRow:"table", //add rows relative to the table
    height : "50vh",
    locale: "ko-kr",
    langs:{
        "ko-kr":{
            "columns":{
                // "name":"Name",
                 //replace the title of column name with the value "Name"
            
            },
            "data":{
                "loading":"Loading", //data loader text
                "error":"Error", //data error text
            },
            "groups":{ //copy for the auto generated item count in group header
                "item":"item", //the singular  for item
                "items":"items", //the plural for items
            },
            "pagination":{
            	"page_size":"행 개수", //label for the page size select element
                "page_title":"Show Page",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
                "first":"처음", //text for the first page button
                "first_title":"첫 페이지", //tooltip text for the first page button
                "last":"뒤 페이지",
                "last_title":"뒤 페이지",
                "prev":"이전",
                "prev_title":"이전 페이지",
                "next":"다음",
                "next_title":"다음 페이지",
                "all":"전체",
                "counter":{
                    "showing": "보여지기",
                    "of": "중",
                    "rows": "행",
                    "pages": "pages",
                }
            },
            
        }
    },
    rowFormatter:function(row : any){
        row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
     
  },

   
  
  
    
}






export {
   
    TABLE_TOTAL_CONFIG,
    TABLE_HEADER_CONFIG,

    MODAL_TABLE_HEADER_CONFIG,


    TABLE_FILTER,
    EXCEL_CONFIG,
    
}


