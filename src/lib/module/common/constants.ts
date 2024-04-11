//@ts-nocheck
import { DateTime } from 'luxon';


import {item_modal_state} from '$lib/store/item/state';




import {itemModalOpen} from '$lib/store/item/function';


import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from './function';

import { userModalOpen} from '$lib/store/user/function';

import { factoryModalOpen} from '$lib/store/factory/function';
import { employmentModalOpen} from '$lib/store/employment/function';
import { typeModalOpen} from '$lib/store/type/function';
import { departmentModalOpen} from '$lib/store/department/function';

import { cosmeticMaterialModalOpen } from '$lib/store/cosmetic_material/function';
import { restricMaterialModalOpen } from '$lib/store/restric_material/function';
import { restricMaterialCountryModalOpen } from '$lib/store/restric_material_country/function';

import { equipmentModalOpen} from '$lib/store/equipment/function';
import { bomModalOpen,itemSelect,bomSelect,bomSearchModalOpen,bomSelectDelete,bomSubAddRow} from '$lib/store/bom/function';
import { processModalOpen,processQcSelectDelete} from '$lib/store/process/function';
import moment from 'moment';

import axios from 'axios'

const api = import.meta.env.VITE_API_BASE_URL;




const LOGIN_ALERT = {
    type : 'success',
    title : '로그인',
    content : '로그인에 실패했습니다. 계정 및 비밀번호를 확인해주십시오,',
    
}


const CLIENT_INFO = {  // 업체정보
   
    code  : " 314-86-46990",
    company_name : "주식회사 에코바이오의학연구소",
    name : "구태규",
    address : "대전 유성구 전민동 461-6 한남대학교 대덕밸리캠퍼스 이노비즈파크 308호",
    type : "화장품 판매업",
    type2 : "",
    fax : "042-825-8818",

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
    
    code : {title : '코드에러', content : '코드가 중복되었습니다. 데이터를 변경해주세요.'},
    
    print : {title : '출력', content : '데이터 출력에 실패했습니다. 데이터를 1개 이상 선택해주세요.'},
    
}

const DATA_SELECT_ALERT = {
    color : 'red',
    select : {title : '실패', content : '데이터를 1개 이상 선택해주세요.'},
}

const MENU = {
    info : [
        {url : "/info/item",name: '품목 관리', help: " 품목관리란, 취급하는 상품에 대한 관리 메뉴를 뜻합니다."},
        {url : "/info/user",name: '회원 관리', help: " 회원관리란, 프로그램 사용자 정보를 관리하는 메뉴를 뜻합니다."},
        {url : "/info/company",name: '거래처 관리', help: " 거래처 관리란, 거래처 정보를 관리하는 메뉴를 뜻합니다."},

      ],

      customer : [
      
      ],
      sale : [
      
      ],
}


const TOAST_SAMPLE = {
   
    success : {type : 'success', value : false, counter : 2},
    fail : {type : 'fail', value : false, counter : 2}
    
}


const TABLE_FILTER : any = {
    type : [
        {value : "all",name : "전체"},
        {value : "name", name : "품목구분"},
        {value : "company", name : "사업장"},
    ],

    item : [
    {value : "all",name : "전체"},
    {value : "code", name : "코드"},
    {value : "type", name : "분류"},
    {value : "company", name : "취급사"},
  
    ],
    company : [
        {value : "all",name : "전체"},
        {value : "code", name : "사업자등록번호"},
        {value : "name", name : "매입처명"},
        {value : "owner_name", name : "대표자명"},

        {value : "emp_name", name : "담당자명"},

        {value : "email", name : "이메일"},
    ],
    employment : [
        {value : "all",name : "전체"},
        {value : "name", name : "직급"},
        {value : "name2", name : "직책"},
        {value : "company", name : "사업장"},
        
    ], department : [
        {value : "all",name : "전체"},
        {value : "name", name : "부서명"},
        {value : "company", name : "사업장"},
     
        
    ],
    factory : [
        {value : "all",name : "전체"},
        {value : "name", name : "공장명"},
        {value : "status", name : "용도"},
        {value : "company", name : "사업장"},
       
    ],
    user : [
        {value : "all",name : "전체"},
        {value : "id", name : "ID"},
        {value : "company", name : "사업장"},
        {value : "employment", name : "직급"},
        {value : "department", name : "부서"},
    
        {value : "name", name : "이름"},
        {value : "email", name : "이메일"},
        {value : "phone", name : "연락처"},
    ], 
    cosmetic_material : [
        {value : "all",name : "전체"},
        {value : "ingr_kor_name", name : "표준명"},
        {value : "ingr_eng_name", name : "영문명"},
        {value : "cas_no", name : "CasNO"},
        {value : "ingr_synonym", name : "이명"},
        {value : "origin_major_kor_name", name : "기원 및 정의"},

    ], 
    restric_material : [
        {value : "all",name : "전체"},
        {value : "regulate_type", name : "구분"},
        {value : "ingr_std_name", name : "표준명"},
        {value : "ingr_eng_name", name : "영문명"},
        {value : "cas_no", name : "CasNO"},
        {value : "ingr_synonym", name : "이명"},
        {value : "country_name", name : "배합제한국가"},
        {value : "notice_ingr_name", name : "고시원료명"},
        {value : "provis_atrcl", name : "단서조항"},
        {value : "limit_cond", name : "제한사항"},
        
    ], 
    restric_material_country : [
        {value : "all",name : "전체"},
        {value : "regulate_type", name : "구분"},
        {value : "regl_code", name : "규제코드"},
        {value : "ingr_code", name : "성분코드"},
        {value : "country_name", name : "배합제한국가"},
        {value : "notice_ingr_name", name : "고시원료명"},
        {value : "provis_atrcl", name : "단서조항"},
        {value : "limit_cond", name : "제한사항"},
        
    ],   
    equipment : [
        {value : "all",name : "전체"},
        {value : "name", name : "설비명"},
        {value : "purpose", name : "용도"},
        {value : "description", name : "규격"},
        {value : "company", name : "사업장"},
        

    ],
    bom : [
        {value : "all",name : "전체"},
        {value : "code", name : "코드"},
        {value : "ingr_kor_name", name : "한글명"},
        {value : "ingr_eng_name", name : "영문명"},
            

    ],
    process : [
        {value : "all",name : "전체"},
        {value : "name", name : "공정명"},
        {value : "status", name : "용도"},
        {value : "description", name : "비고"},
            

    ],
}





const EXCEL_CONFIG : any = {
   
    item : [
 
    {header: '코드', key: 'code', width: 30},
   
   
    {header: '등록일', key: 'created', width: 30},
    ],
  

    company : [
     
        {header: '사업자등록번호', key: 'code', width: 30},
        {header: '회사명', key: 'name', width: 30},
        {header: '대표자', key: 'owner_name', width: 30},
        {header: '대표자 연락처', key: 'owner_phone', width: 30},
        {header: '담당자', key: 'emp_name', width: 30},
        {header: '담당자 연락처', key: 'emp_phone', width: 30},
        {header: 'Fax', key: 'fax', width: 30},
        

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
     
        {header: '분류', key: "type", width: 30},
        {header: '상품명', key: 'name', width: 150},
        {header: '개수', key: 'qty', width: 30},

        {header: '등록일', key: 'created', width: 30},
        ],

        cosmetic_material : [
        
        
            {key : "ingr_kor_name", header : "표준명", width: 30},
            {key : "ingr_eng_name", header : "영문명", width: 30},
            {key : "cas_no", header : "CasNO", width: 30},
            {key : "ingr_synonym", header : "이명", width: 30},
           
            {key : "origin_major_kor_name", header : "기원및정의", width: 30},
         
            
        ],

        restric_material : [
        
            {key : "regulate_type", header : "구분", width: 30},
            {key : "ingr_std_name", header : "표준명", width: 30},
            {key : "ingr_eng_name", header : "영문명", width: 30},
            {key : "cas_no", header : "CasNO", width: 30},
            {key : "ingr_synonym", header : "이명", width: 30},
            {key : "country_name", header : "배합제한국가", width: 30},
            {key : "notice_ingr_name", header : "고시원료명", width: 30},
            {key : "provis_atrcl", header : "단서조항", width: 30},
            {key : "limit_cond", header : "제한사항", width: 30},
            
        ],
        restric_material_country : [
        
            {key : "regulate_type", header : "구분", width: 30},
            {key : "regl_code", header : "규제코드", width: 30},
            {key : "ingr_code", header : "성분명", width: 30},
            {key : "country_name", header : "배합제한국가", width: 30},
            {key : "notice_ingr_name", header : "고시성분명", width: 30},
            {key : "provis_atrcl", header : "단서조항", width: 30},
            {key : "limit_cond", header : "제한사항", width: 30},
            
        ],
        equipment : [
        
            {header: '사업장', key: 'company', width: 30},
            {header: '설비명', key: 'name', width: 30},
            {header: '용도', key: 'purpose', width: 30},
            {header: '비고', key: 'description', width: 30},
      
        ],
        bom : [
        
            {header: '품목코드', key: 'code', width: 30},
            {header: '한글명', key: 'ingr_kor_name', width: 30},
            {header: '영문명', key: 'ingr_eng_name', width: 30},
              
        ],
        process : [
        
            {header: '공정명', key: 'name', width: 30},
            {header: '용도', key: 'status', width: 30},
            {header: '비고', key: 'description', width: 30},
              
        ],
    
}; 



const MODAL_TABLE_HEADER_CONFIG : any = {
    item : [
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
                itemSelect(row.getData());
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
    bom_search : [
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
                bomSelect(cell);
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

    bom : [
        // {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        // cellClick:function(e : any, cell:any){
        //     cell.getRow().toggleSelect()
        // }},
        // {title:"ID", field: "uid", width:100, headerFilter:"input"},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},

        {title:"BOM코드", field:"code", width:150, headerFilter:"input", 
        
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },
        cellClick:function(e : any, cell:any){
                let row = cell.getRow();
                if(row){
                  
                    bomSearchModalOpen('bom_search',row);
                }else{
                    
                }
        }
        },
        {title:"품목명", field:"name", width:150, headerFilter:"input",
    
       

        },
       

        {title:"수량", field:"qty", width:150, headerFilter:"input",editor:"input",},
        {title:"비율", field:"rate", width:150, headerFilter:"input",editor:"input",},
        {
            title: "추가",
            width:100,
            headerSort: false,
            formatter: function (cell:any, formatterParams:any, onRendered:any) {
                var row = cell.getRow();
                // "+" 아이콘 버튼
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "<i class='fas fa-plus'></i>"; // Font Awesome 등의 아이콘을 사용하는 예시
                deleteButton.classList.add("icon-button"); // 아이콘 버튼에 클래스 추가
                deleteButton.addEventListener("click", function () {
                    // let add_qty = parseInt(rowData.qty) + 1;
                    // row.update({qty : add_qty});
                    bomSubAddRow(row.getData(),cell);
                });
            
                var container = document.createElement("div");
                container.style.display = "flex"; // 아이콘 버튼들을 가로로 나란히 표시하기 위해 Flexbox 사용
                container.style.justifyContent = "space-between"; // 좌우로 간격 주기
                container.style.margin = "0 5px"; // 좌우 마진 5px 주기
                container.appendChild(deleteButton);
            
             
                return container;
            }

        }, 
      

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
                    bomSelectDelete(cell);
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

    process_qc : [
        // {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        // cellClick:function(e : any, cell:any){
        //     cell.getRow().toggleSelect()
        // }},
        // {title:"ID", field: "uid", width:100, headerFilter:"input"},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},

        {title:"검사명", field:"name", width:150, headerFilter:"input", editor:"input",
  
        },

        {title:"검사유형", field:"type", width:150,  editor:"list", editorParams:{values:{"합불":"합불", "수치":"수치"}}},
        {title:"비고", field:"description", width:150, headerFilter:"input", editor:"input",
  
    },
    
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
                    processQcSelectDelete(cell);
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
    type : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        { title: "ID", formatter: "rownum", align: "center", width: 70,}, 
        {title:"품목구분", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
              
                typeModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],


    item : [
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
                itemModalOpen(row.getData(),"update");
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
    employment : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        { title: "ID", formatter: "rownum", align: "center", width: 70,}, 
        {title:"직급", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                employmentModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        {title:"직책", field:"name2", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],
    department : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        { title: "ID", formatter: "rownum", align: "center", width: 70,}, 
        {title:"부서명", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                departmentModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
      
      
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
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
        {title:"ID",  formatter: "rownum", width:150, headerFilter:"input"},
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
        
    {title:"대표자 연락처", field:"owner_phone", width:150, headerFilter:"input", formatter:function(cell : any){
        var value = cell.getValue();
    return phoneNumber(value);
     }},
     {title:"담당자 연락처", field:"emp_phone", width:150, headerFilter:"input", formatter:function(cell : any){
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

    factory : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        { title: "ID", formatter: "rownum", align: "center", width: 70,}, 
        {title:"공장명", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },
        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                factoryModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        {title:"용도", field:"status", width:150, headerFilter:"input"},
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
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
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
        {title:"부서", field:"department.name", width:150, headerFilter:"input"},
        {title:"직급", field:"employment.name", width:150, headerFilter:"input"},
        {title:"이름", field:"name", width:500, headerFilter:"input", 
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
    {title:"ID",  formatter: "rownum", width:150, headerFilter:"input"},
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

   ],
   cosmetic_material : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect()
    }},
    {title:"ID",  formatter: "rownum", width:150, headerFilter:"input"},
    
    {title:"표준명", field:"ingr_kor_name", width:500, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
    },

    cellClick:function(e : any, cell:any){
        let row = cell.getRow();
    if(row){
        cosmeticMaterialModalOpen(row.getData(),"update");
    }else{
    
    }
    }
},
{title:"영문명", field:"ingr_eng_name", width:150, headerFilter:"input"},

{title:"CasNO", field:"cas_no", width:150, headerFilter:"input"},

{title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
formatter: function(cell : any, formatterParams: any, onRendered: any) {
    // Luxon을 사용하여 datetime 값을 date로 변환
    const datetimeValue = cell.getValue();
    const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
    return date;
}},   

],

   restric_material : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID",  formatter: "rownum", width:150, headerFilter:"input"},
        {title:"구분", field:"regulate_type", width:150, headerFilter:"input"},
        
        {title:"표준명", field:"ingr_std_name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
        if(row){
            restricMaterialModalOpen(row.getData(),"update");
        }else{
        
        }
        }
    },
    {title:"CasNO", field:"cas_no", width:150, headerFilter:"input"},
    {title:"배합제한국가", field:"country_name", width:150, headerFilter:"input"},
    {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
    formatter: function(cell : any, formatterParams: any, onRendered: any) {
        // Luxon을 사용하여 datetime 값을 date로 변환
        const datetimeValue = cell.getValue();
        const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
        return date;
    }},   
    
 ],
 restric_material_country : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect()
    }},
    {title:"ID",  formatter: "rownum", width:150, headerFilter:"input"},
    {title:"구분", field:"regulate_type", width:150, headerFilter:"input"},
    {title:"규제코드", field:"regl_code", width:150, headerFilter:"input"},
    
    {title:"성분코드", field:"ingr_code", width:500, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
    },

    cellClick:function(e : any, cell:any){
        let row = cell.getRow();
    if(row){
        restricMaterialCountryModalOpen(row.getData(),"update");
    }else{
    
    }
    }
},
{title:"배합제한국가", field:"country_name", width:150, headerFilter:"input"},
{title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
formatter: function(cell : any, formatterParams: any, onRendered: any) {
    // Luxon을 사용하여 datetime 값을 date로 변환
    const datetimeValue = cell.getValue();
    const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
    return date;
}},   

],
equipment : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect()
    }},
    { title: "ID", formatter: "rownum", align: "center", width: 70,}, 
    {title:"설비명", field:"name", width:150, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },

    cellClick:function(e : any, cell:any){
        let row = cell.getRow();
        if(row){
            equipmentModalOpen(row.getData(),"update");
        }else{
            
        }
        }
    },
    {title:"용도", field:"purpose", width:150, headerFilter:"input"},
    {title:"비고", field:"description", width:150, headerFilter:"input"},

    {title:"사업장", field:"company.name", width:150, headerFilter:"input"},
    {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
    formatter: function(cell : any, formatterParams: any, onRendered: any) {
        // Luxon을 사용하여 datetime 값을 date로 변환
        const datetimeValue = cell.getValue();
        const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
        return date;
    },
}],
    bom : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"BOM코드", field:"code", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                let data = row.getData();
                if(data['parent_uid'] === 0){
                    bomModalOpen(row.getData(),"update");
                }else{
                    window.alert('읽기 또는 수정은 최상위 BOM에서만 가능합니다.');
                }
              
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
    process : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", formatter: "rownum", width:150, headerFilter:"input"},
        
        {title:"사업장", field:"company.name", width:150, headerFilter:"input"},

        {title:"공정명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
        },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                processModalOpen(row.getData(),"update");
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

    MODAL_TABLE_HEADER_CONFIG,


    TABLE_COMPONENT,
    TABLE_FILTER,
    EXCEL_CONFIG,
    
    CLIENT_INFO
}


