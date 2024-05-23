//@ts-nocheck
import { DateTime } from 'luxon';


import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from '$lib/module/common/function';



import { stockModalOpen} from '$lib/store/stock/function';
import { stockInoutSubItemSearchModalOpen,stockInoutSubSelectDelete,stockInoutModalOpen,stockInoutSubitemSelect,stockInoutPrint} from '$lib/store/stock_inout/function';



import moment from 'moment';

import axios from 'axios'




const TABLE_FILTER : any = {
   
    stock : [
        {value : "all",name : "전체"},
        {value : "lot", name : "로트"},
        {value : "ingr_eng_name", name : "영문명"},
    ],   
    stock_record : [
        {value : "all",name : "전체"},
        {value : "lot", name : "로트"},
        {value : "ingr_eng_name", name : "영문명"},
    ],
    stock_inout : [
        {value : "all",name : "전체"},
        {value : "doc_type", name : "입출고 사유"},
        {value : "status", name : "입출고"},
    ],
    
}





const EXCEL_CONFIG : any = {
   
        stock : [
            {header: '로트', key: 'lot', width: 30},
            {header: '품명', key: 'item.name', width: 30},
            {header: '공장명', key: 'factory.name', width: 30},
            {header: '창고명', key: 'factory_sub.name', width: 30},
            {header: '수량', key: 'qty', width: 30},
            {header: '단위', key: 'unit', width: 30},
            {header: '용도', key: 'status', width: 30},
        ],
        stock_inout : [
            {header: '입출고유형', key: 'doc_type', width: 30},
            {header: '상태', key: 'status', width: 30},
            {header: '작업자', key: 'user.user_id', width: 30},
        
        ],
     
    
    
}; 



const MODAL_TABLE_HEADER_CONFIG : any = {

    stock_inout_item_search : [
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
                stockInoutSubitemSelect(cell);
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

    stock_inout_stock_search : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"품목구분", field:"item.type.name", width:150, headerFilter:"input"},

        {title:"코드", field:"item.code", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(cell){
                stockInoutSubitemSelect(cell);
            }else{
                
            }
            }
        },
        {title:"공장", field:"factory.name", width:150, headerFilter:"input"},
        {title:"창고", field:"factory_sub.name", width:150, headerFilter:"input"},
        
        
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],


    
    stock : [
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        
        
        {title:"LOT", field:"lot", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<p style='color:red; font-weight:bold; white-space : pre-line; '>" + value + "</p>";
        }
        },


        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
        {title:"영문명", field:"item.ingr_eng_name", width:150, headerFilter:"input",},
        {title:"공장명", field:"factory.name", width:150, headerFilter:"input",},
        {title:"창고명", field:"factory_sub.name", width:150, headerFilter:"input",},
    
        {title:"수량", field:"qty", width:150, formatter: "money",  formatterParams: { thousand:",",precision:false,}},
        {title:"단위", field:"unit", width:150, headerFilter:"input", },

    
        {
            title: "재고조정",
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
             
                // "+" 아이콘 버튼
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "<i class='fas fa-pen'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                deleteButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                deleteButton.addEventListener("click", function () {
               
                 
                     
        
                    // estimateSubSelectDelete(cell); -> 재고조정 로직 추가
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

    stock_inout_sub : [
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        {title:"LOT", field:"lot", width:150, headerFilter:"input",editor : "input"},
       
        {title:"성분명", field:"item.ingr_eng_name", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },
        cellClick:function(e : any, cell:any){
                let row = cell.getRow();
                if(row){
                  
                    stockInoutSubItemSearchModalOpen('stock_inout_item_search',row);
                }else{
                    
                }
        }
        },

        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
       
        {title:"수량", field:"qty", width:150, editor : "input",formatter: "money",  formatterParams: {
          
            thousand:",",
            precision:false,

        }},
        {title:"용량", field:"unit", width:150, headerFilter:"input",editor : "input"},
    
        {title:"공장명", field:"factory_name", width:150, headerFilter:"input",},
        {title:"창고명", field:"factory_sub_name", width:150, headerFilter:"input",},
    
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
                    stockInoutSubSelectDelete(cell);
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
  

    stock : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},

        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        
        
        {title:"LOT", field:"lot", width:150, headerFilter:"input", 
        
      
        },


        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
        {title:"영문명", field:"item.ingr_eng_name", width:150, headerFilter:"input",},
        {title:"공장명", field:"factory.name", width:150, headerFilter:"input",},
        {title:"창고명", field:"factorySub.name", width:150, headerFilter:"input",},
    
        {title:"수량", field:"qty", width:150, formatter: "money",  formatterParams: { thousand:",",precision:false,}},
        {title:"단위", field:"unit", width:150, headerFilter:"input", },

    
        {
            title: "재고조정",
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
             
                // "+" 아이콘 버튼
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "<i class='fas fa-pen'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                deleteButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                deleteButton.addEventListener("click", function () {
                    let row = cell.getRow();
                    stockModalOpen(row.getData(),"update");

                
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
    stock_record : [
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        
        
        {title:"LOT", field:"lot", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<p style='color:red; font-weight:bold; white-space : pre-line; '>" + value + "</p>";
        }
        },


        {title:"한글명", field:"item.ingr_kor_name", width:150, headerFilter:"input",},
        {title:"영문명", field:"item.ingr_eng_name", width:150, headerFilter:"input",},
        {title:"불출공장", field:"outFactory.name", width:150, headerFilter:"input",},
        {title:"불출창고", field:"outFactorySub.name", width:150, headerFilter:"input",},
        
        {title:"수령공장", field:"inFactory.name", width:150, headerFilter:"input",},
        {title:"수령창고", field:"inFactory_sub.name", width:150, headerFilter:"input",},
    
        {title:"수불수량", field:"qty", width:150, formatter: "money",  formatterParams: { thousand:",",precision:false,}},
        {title:"단위", field:"unit", width:150, headerFilter:"input", },

    
    ],

    stock_inout: [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        {title:"상태", field:"status", width:150, headerFilter:"input"},
         {title:"입출고유형", field:"doc_type", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                stockInoutModalOpen(row.getData(),"update");
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
        },
        
        {
            title: "바코드인쇄",
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
                
                let row = cell.getRow();

                // "+" 아이콘 버튼
                var utilButton = document.createElement("button");
                utilButton.innerHTML = "<i class='fas fa-print'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                utilButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                utilButton.addEventListener("click", function () {
               
                    stockInoutPrint(row.getData());
                     
        
                    // estimateSubSelectDelete(cell); -> 재고조정 로직 추가
                });
            
                var container = document.createElement("div");
                container.style.display = "flex"; // 아이콘 버튼들을 가로로 나란히 표시하기 위해 Flexbox 사용
                container.style.justifyContent = "space-between"; // 좌우로 간격 주기
                container.style.margin = "0 5px"; // 좌우 마진 5px 주기
                container.appendChild(utilButton);
                return container;
            }
        },



    ],


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


