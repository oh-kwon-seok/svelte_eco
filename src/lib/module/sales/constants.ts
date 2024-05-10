//@ts-nocheck
import { DateTime } from 'luxon';


import {item_modal_state} from '$lib/store/item/state';




import {itemModalOpen} from '$lib/store/item/function';


import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from '$lib/module/common/function';

import { estimateModalOpen,estimateSubitemSelect,estimateSubItemSearchModalOpen,estimateSubSelectDelete, bookmarkEstimateSelect,estimateCompanySelect} from '$lib/store/estimate/function';

import { orderModalOpen,orderSubitemSelect,orderSubItemSearchModalOpen,orderSubSelectDelete, estimateSelect,orderCompanySelect} from '$lib/store/order/function';



import moment from 'moment';

import axios from 'axios'




const TABLE_FILTER : any = {
   
    estimate : [
        {value : "all",name : "전체"},
        {value : "code", name : "견적코드"},
        {value : "name", name : "견적명"},
        {value : "client", name : "납품처"},
        {value : "description", name : "비고"},
            

    ],
    order : [
        {value : "all",name : "전체"},
        {value : "code", name : "주문코드"},
        {value : "name", name : "주문명"},
        {value : "client", name : "납품처"},
        {value : "description", name : "비고"},
            

    ],
}





const EXCEL_CONFIG : any = {
   
        estimate : [
            {header: '견적코드', key: 'code', width: 30},
            {header: '견적명', key: 'name', width: 30},
            {header: '용도', key: 'status', width: 30},
            {header: '비고', key: 'description', width: 30},
              
        ],
        order : [
            {header: '주문코드', key: 'code', width: 30},
            {header: '주문명', key: 'name', width: 30},
            {header: '용도', key: 'status', width: 30},
            {header: '비고', key: 'description', width: 30},
              
        ],
    
    
}; 



const MODAL_TABLE_HEADER_CONFIG : any = {
    estimate_company_search : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },

        {title:"상호", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                estimateCompanySelect(row.getData());
            }else{
                
            }
            }
        },
            
        {title:"대표자 연락처", field:"owner_phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
        }},
        {title:"담당자 연락처", field:"emp_phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
        }},
            

        {title:"취급사", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
   
 
    estimate_item_search : [
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
            if(cell){
                estimateSubitemSelect(cell);
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
    estimate_bookmark_estimate_search :[
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"견적명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(cell){
                bookmarkEstimateSelect(cell);
            }else{
                
            }
            }
        },
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
    estimate_sub : [
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        {title:"제한국가", field:"country_name", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<p style='color:red; font-weight:bold; white-space : pre-line; '>" + value + "</p>";
        }
        },

        {title:"성분명", field:"item.ingr_eng_name", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },
        cellClick:function(e : any, cell:any){
                let row = cell.getRow();
                if(row){
                  
                    estimateSubItemSearchModalOpen('estimate_item_search',row);
                }else{
                    
                }
        }
        },

        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
       
        {title:"수량", field:"qty", width:150, editor : "input",formatter: "money",  formatterParams: {
          
            thousand:",",
            precision:false,

        },cellEdited: updateSupplyPrice},
        {title:"용량", field:"unit", width:150, headerFilter:"input",editor : "input"},
       
        {title:"매입단가", field:"buy_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },
        formatterParams: {
            
            thousand:",",
            symbol:"원",
          symbolAfter:"p",
          precision:0,
      }},

        {title:"매출단가", field:"price", width:150, editor : "input",
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },

        formatter: "money",  formatterParams: {
            
              thousand:",",
              symbol:"원",
            symbolAfter:"p",
            precision:false,

        },cellEdited: updateSupplyPrice},
      


        {title:"공급가액", field:"supply_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },
        formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        {title:"부가세", field:"vat_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },

        formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        {title:"비고", field:"description", width:150, headerFilter:"input",editor : "input"},

    
        {
            title: "삭제",
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
             
                // "+" 아이콘 버튼
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "<i class='fas fa-trash'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                deleteButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                deleteButton.addEventListener("click", function () {
                    // let add_qty = parseInt(rowData.qty) + 1;
                    // row.update({qty : add_qty});
                    estimateSubSelectDelete(cell);
                });
            
                var container = document.createElement("div");
                container.style.display = "flex"; // 아이콘 버튼들을 가로로 나란히 표시하기 위해 Flexbox 사용
                container.style.justifyContent = "space-between"; // 좌우로 간격 주기
                container.style.margin = "0 5px"; // 좌우 마진 5px 주기
                container.appendChild(deleteButton);
            
             
                return container;
            }

        },
        


    ],

    order_company_search : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },

        {title:"상호", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                orderCompanySelect(row.getData());
            }else{
                
            }
            }
        },
            
        {title:"대표자 연락처", field:"owner_phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
        }},
        {title:"담당자 연락처", field:"emp_phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
        }},
            

        {title:"취급사", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
   
 
    order_item_search : [
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
            if(cell){
                estimateSubitemSelect(cell);
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
    order_estimate_search :[
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"견적명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(cell){
                estimateSelect(cell);
            }else{
                
            }
            }
        },
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
    order_sub : [
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        {title:"제한국가", field:"country_name", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<p style='color:red; font-weight:bold; white-space : pre-line; '>" + value + "</p>";
        }
        },

        {title:"성분명", field:"item.ingr_eng_name", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },
        cellClick:function(e : any, cell:any){
                let row = cell.getRow();
                if(row){
                  
                    orderSubItemSearchModalOpen('estimate_item_search',row);
                }else{
                    
                }
        }
        },

        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
       
        {title:"수량", field:"qty", width:150, editor : "input",formatter: "money",  formatterParams: {
          
            thousand:",",
            precision:false,

        },cellEdited: updateSupplyPrice},
        {title:"용량", field:"unit", width:150, headerFilter:"input",editor : "input"},
       
        {title:"매입단가", field:"buy_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },
        formatterParams: {
            
            thousand:",",
            symbol:"원",
          symbolAfter:"p",
          precision:0,
      }},

        {title:"매출단가", field:"price", width:150, editor : "input",
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },

        formatter: "money",  formatterParams: {
            
              thousand:",",
              symbol:"원",
            symbolAfter:"p",
            precision:false,

        },cellEdited: updateSupplyPrice},
      


        {title:"공급가액", field:"supply_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },
        formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        {title:"부가세", field:"vat_price", width:150, editor : "input",formatter: "money",  
        bottomCalc:"sum", 
        bottomCalcFormatter:function(cell : any){
            var value = cell.getValue();
        return commaNumber(value);
         },

        formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        {title:"비고", field:"description", width:150, headerFilter:"input",editor : "input"},

    
        {
            title: "삭제",
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
             
                // "+" 아이콘 버튼
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "<i class='fas fa-trash'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                deleteButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                deleteButton.addEventListener("click", function () {
                    // let add_qty = parseInt(rowData.qty) + 1;
                    // row.update({qty : add_qty});
                    orderSubSelectDelete(cell);
                });
            
                var container = document.createElement("div");
                container.style.display = "flex"; // 아이콘 버튼들을 가로로 나란히 표시하기 위해 Flexbox 사용
                container.style.justifyContent = "space-between"; // 좌우로 간격 주기
                container.style.margin = "0 5px"; // 좌우 마진 5px 주기
                container.appendChild(deleteButton);
            
             
                return container;
            }

        },
        


    ],


}
const TABLE_HEADER_CONFIG : any = {
  

    estimate : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"견적명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                estimateModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
    order: [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"주문명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                orderModalOpen(row.getData(),"update");
            }else{
                
            }
            }
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


