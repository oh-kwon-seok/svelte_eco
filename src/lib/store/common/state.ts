

import { writable } from 'svelte/store';
import moment from 'moment';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';




const menu_state = writable({
  home : false,
  info : false,
  project : false,
  process_equipment : false,
  item : false,
  shipment : false,

});






const cookie_state = getCookie('my-cookie');
const load_state = writable(false);

const url_state : any = writable({ path : '', query : ''});


  const common_alert_state : any = writable({type : 'save', value : false , content : ""});

  const common_toast_state : any = writable({type : 'success', value : false, counter : 4 });

  const common_search_state : any = writable({
    start_date : moment().subtract(1, "year").format('YYYY-MM-DD'),
    end_date : moment().add(1, "day").format('YYYY-MM-DD'),
    search_text : '',
    filter : [],
    filter_title : "all",
  });


 

  const login_state : any = writable({
    user_idx : "",
    id : "",
    name : "",
    password : "",
    token :"",
    company_uid : 0,
    status : false,
    
  });


  const table_list_state : any = writable({  // 메뉴별 페이지에 있는 리스트
    item : "",
    company : "",
    user : "",
    bom : "",
    department : "",
    employment : "",
    equipment : "",
    factory : "",
    factory_sub : "",
    cosmetic_material : "",
    restric_material : "",
    restric_material_country_state : "",
    process : "",

    
  });

  const table_modal_state : any = writable({  // 모달에서 쓰는 리스트
    item : "",
    bom : "",
    process_qc : "",
   
  });

  // common 은 창고나 공장 등 정보를 select하기위해서 필요한 기능임 infoCallAPI 용



  // 기준정보
  const common_user_state : any = writable([]);
  const common_type_state : any = writable([]);
  const common_item_state : any = writable([]);
  const common_company_state : any = writable([]);
  const common_department_state : any = writable([]);
  const common_employment_state : any = writable([]);
  const common_factory_state : any = writable([]);
  const common_factory_sub_state : any = writable([]);
  const common_cosmetic_material_state : any = writable([]);
  
  const common_restric_material_state : any = writable([]);
  
  const common_restric_material_country_state : any = writable([]);

  const common_equipment_state : any = writable([]);

  const common_bom_state : any =  writable([]);
  const common_process_state : any =  writable([]);
  
  const common_bookmark_estimate_state : any =  writable([]);

  // 영업
  const sales_estimate_state : any =  writable([]);
  const sales_order_state : any =  writable([]);
  const sales_ship_order_state : any =  writable([]);
  

  
  // 재고
  const stock_stock_state : any =  writable([]);
  const stock_stock_record_state : any =  writable([]);
  const stock_stock_inout_state : any =  writable([]);

    
  // 생산
  const production_work_plan_state : any =  writable([]);
 
  const production_work_task_state : any =  writable([]);
 
  
  // filter Data 해당 항목을 선택했을 때 하위로 나오는 데이터들임
  const common_company_filter_state : any = writable([]); // 매입매출이 아닌 사업장 데이터임

  const common_factory_sub_filter_state : any = writable([]);


  const common_selected_state : any = writable([]); // 삭제용 데이터

  export {menu_state,
    cookie_state,
    load_state,
    common_alert_state,
    common_search_state,
    login_state,
    url_state,
    table_list_state,
    table_modal_state,
    common_toast_state,
    common_user_state,
    common_type_state,
    common_item_state,
    common_company_state,
    common_department_state,
    common_employment_state,
    common_factory_state,
    common_factory_sub_state,
    common_selected_state,
    
    common_cosmetic_material_state,
    common_restric_material_state,
    common_restric_material_country_state,
    common_equipment_state,
    common_bom_state,
    common_process_state,
    common_bookmark_estimate_state,

    sales_estimate_state ,
    sales_order_state ,
    sales_ship_order_state,
    
    stock_stock_state,
    stock_stock_record_state,
    stock_stock_inout_state,

    production_work_plan_state,
    production_work_task_state,
    common_company_filter_state,
    common_factory_sub_filter_state
    

  };
