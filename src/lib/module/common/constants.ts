//@ts-nocheck
import { DateTime } from 'luxon';


import {item_modal_state} from '$lib/store/item/state';




import {itemModalOpen} from '$lib/store/item/function';


import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from './function';

import { userModalOpen} from '$lib/store/user/function';

import { factoryModalOpen} from '$lib/store/factory/function';
import moment from 'moment';

import axios from 'axios'

const api = import.meta.env.VITE_API_BASE_URL;




const LOGIN_ALERT = {
    type : 'success',
    title : '로그인',
    content : '로그인에 실패했습니다. 계정 및 비밀번호를 확인해주십시오,',
    
}


const CLIENT_INFO = {  // 업체정보
   
    code  : "314-13-24575",
    company_name : "장안유통(대청254번)",
    name : "김옥병",
    address : "대전시 대덕구 오정동 705 대청254번",
    type : "도,소매",
    type2 : "음식재료",
    fax : "042-369-6892",

}

const DATA_SUCCESS_ALERT = {
    color : 'blue',
    data : [{
        title : '저장', 
        content : '데이터 저장에 성공했습니다.',
    },
    {
        title : '수정', 
        content : '데이터 수정에 성공했습니다.',
    },
    {
        title : '삭제', 
        content : '데이터 삭제에 성공했습니다.',
    }]
}


const DATA_FAIL_ALERT = {
    color : 'red',
    add : {title : '추가', content : '데이터 저장에 실패했습니다.'},

    update : {title : '수정', content : '데이터 수정에 실패했습니다.'},
    delete : {title : '삭제', content : '데이터 삭제에 실패했습니다.'},
    check_delete : {title : '선택 삭제', content : '데이터 삭제에 실패했습니다. 데이터를 1개 이상 선택해주세요.'},
    error : {title : '통신에러', content : '에러가 발생했습니다.관리자에게 문의해주십시오.'},
    print : {title : '출력', content : '데이터 출력에 실패했습니다. 데이터를 1개 이상 선택해주세요.'},
    
}

const DATA_SELECT_ALERT = {
    color : 'red',
    select : {title : '실패', content : '데이터를 1개 이상 선택해주세요.'},
}

const MENU = {
    info : [
        {url : "/info/item",name: '품목 관리', help: " 품목관리란, 취급하는 상품에 대한 관리 메뉴를 뜻합니다."},
    
      ],

      customer : [
        {url : "/customer/company",name: '매입처 관리', help: " 매입처 관리란, 매입하는 상품에 대한 매입처 관리 메뉴를 뜻합니다. 품목별 관리메뉴에도 관여합니다."},
        {url : "/customer/user",name: '회원 관리', help: " 회원관리란, 주문자에 대한 회원정보를 관리하는 메뉴이며, 선호하는 품목을 사전에 즐겨찾기로 설정하는 메뉴입니다."},
    
      ],
      sale : [
      
      ],
}


const TOAST_SAMPLE = {
   
    success : {type : 'success', value : false, counter : 2},
    fail : {type : 'fail', value : false, counter : 2}
    
}


const TABLE_FILTER : any = {
    item : [
    {value : "all",name : "전체"},
    {value : "name", name : "상품명"},
    {value : "type", name : "분류"},
    {value : "company", name : "매입처"},
  
    ],
    company : [
        {value : "all",name : "전체"},
        {value : "code", name : "사업자등록번호"},
        {value : "name", name : "매입처명"},
        {value : "phone", name : "연락처"},
        {value : "email", name : "이메일"},

        
    ],
    user : [
        {value : "all",name : "전체"},
        {value : "id", name : "ID"},
        {value : "code", name : "사업자번호"},
        {value : "name", name : "이름"},
        {value : "email", name : "이메일"},
        {value : "phone", name : "연락처"},
    ],
}


const TABLE_HEADER_LIST_FILTER : any = {
    type : {"채소류" : "채소류","김치":"김치","수산물":"수산물","육류":"육류","젓갈":"젓갈","건어물":"건어물","냉동":"냉동","일회용품":"일회용품","공산품":"공산품","기타":"기타"}
    
   
}



const EXCEL_CONFIG : any = {
    item : [
    {header: '번호코드', key: 'uid', width: 30},
    {header: '분류', key: "type", width: 30},
    {header: '상품명', key: 'name', width: 30},
   
   
    {header: '등록일', key: 'created', width: 30},
    ],
  

    company : [
        {header: '번호코드', key: 'uid', width: 30},
        {header: '사업자등록번호', key: 'code', width: 30},
        {header: '회사명', key: 'name', width: 30},
        {header: '연락처', key: 'phone', width: 30},
        {header: '이메일', key: 'email', width: 30},
        {header: '등록일', key: 'created', width: 30},
    ],
    user : [
        {header: 'ID', key: 'id', width: 30},
        {header: '지정차량', key: 'car', width: 30},
        {header: '사업자등록번호', key: 'code', width: 30},
        {header: '회사명', key: 'customer_name', width: 30},
        {header: '대표자명', key: 'name', width: 30},
        {header: '연락처', key: 'phone', width: 30},
        {header: '이메일', key: 'email', width: 30},
        {header: '등록일', key: 'created', width: 30},
    ],
    user_item : [
        {header: '번호코드', key: 'uid', width: 30},
        {header: '분류', key: "type", width: 30},
        {header: '상품명', key: 'name', width: 150},
        {header: '개수', key: 'qty', width: 30},

        {header: '등록일', key: 'created', width: 30},
        ],
    
}; 


const TABLE_HEADER_CONFIG : any = {
    item : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"분류", field:"type", width:150, headerFilter:"list",headerFilterParams:{values:TABLE_HEADER_LIST_FILTER['type']}, clearable:true},
      
        {title:"상품명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                itemModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        
        {title:"매입처", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],

    company : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },
        
        {title:"매입처명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
           if(row){
            companyModalOpen(row.getData(),"update");
           }else{
          
           }
        }
    },
        
    {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
        var value = cell.getValue();
    return phoneNumber(value);
     }},
    {title:"이메일", field:"email", width:150, headerFilter:"input"},

        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],

    user : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"id", width:150, headerFilter:"input"},
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },
        {title:"상호명", field:"customer_name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
            
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
           if(row){
            userModalOpen(row.getData(),"update");
           }else{
          
           }
        }
        },
        {title:"지정차량", field:"car.name", width:150, headerFilter:"input"},
        {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
         },},
  
        {title:"이메일", field:"email", width:150, headerFilter:"input"},
        
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        }},     
    
   ],

   user_item : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:true, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect();
        console.log(cell.getRow());
    }},
    {title:"ID", field:"uid", width:150, headerFilter:"input"},
    {title:"분류", field:"type", width:150, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },
    },
    {title:"상품명", field:"name", width:500, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },
    },
    {title:"수량", field:"qty", width:150, editor : "input"},

   ]
}


let TABLE_COMPONENT : any = "example-table-theme";


const TABLE_TOTAL_CONFIG : any = {
    //layout: "fitDataTable",
    layout:"fitData",
    
    pagination:"local",
  
    paginationSize:10,
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
    LOGIN_ALERT,
    DATA_SELECT_ALERT,
    DATA_SUCCESS_ALERT,
    DATA_FAIL_ALERT,
    MENU,
    TOAST_SAMPLE,
    TABLE_TOTAL_CONFIG,
    TABLE_HEADER_CONFIG,
    TABLE_COMPONENT,
    TABLE_FILTER,
    EXCEL_CONFIG,
    TABLE_HEADER_LIST_FILTER,
    CLIENT_INFO
}


