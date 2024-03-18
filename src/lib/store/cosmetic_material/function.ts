

//@ts-nocheck

import { writable } from 'svelte/store';
import {cosmetic_material_modal_state,cosmetic_material_form_state,cosmetic_material_status_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state} from '$lib/store/common/state';
import moment from 'moment';
import {select_query,loadChange} from '$lib/store/common/function';

import {TOAST_SAMPLE} from '$lib/module/common/constants';

import Excel from 'exceljs';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';

const api = import.meta.env.VITE_API_BASE_URL;
const cosmetic_api = import.meta.env.VITE_RESTRICT_COSMETIC_URL;
const cosmetic_key = import.meta.env.VITE_RESTRICT_COSMETIC_KEY;


let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_list_data : any;

let selected_data : any;
let cosmetic_material_status_data : any;



const init_form_data : any = {
  uid : 0,
    
  ingr_kor_name : '',
  ingr_eng_name : '',
  cas_no : '',
  ingr_synonym : '',
  origin_major_kor_name : '',
  used : 1,

}


cosmetic_material_modal_state.subscribe((data) => {
    update_modal = data;
})

cosmetic_material_form_state.subscribe((data) => {
    update_form = data;
})
cosmetic_material_status_state.subscribe((data) => {
    cosmetic_material_status_data = data;
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

common_selected_state.subscribe((data) => {
  selected_data = data;
})
 
 
 



const cosmeticMaterialModalOpen = (data : any, title : any) => {
  console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    cosmetic_material_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);
    if(title === 'update' ){
          Object.keys(update_form).map((item)=> {    
            
            update_form[item] = data[item];
        
          }); 
            cosmetic_material_form_state.update(() => update_form);
            cosmetic_material_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_list_data['cosmetic_material'].getSelectedData();

      common_selected_state.update(() => data);
   
   
  }
}



const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  cosmetic_material_modal_state.update(() => update_modal);


}



const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
 if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/cosmetic_material/delete`
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
              update_modal['title'] = title;
              update_modal[title]['use'] = false;
              cosmetic_material_modal_state.update(() => update_modal);
              cosmetic_material_form_state.update(()=>update_form);

              select_query('cosmetic_material');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            alert['type'] = 'error';
            alert['value'] = true;
            return common_alert_state.update(() => alert);
          };
    

        }
    }
  }


  const cosmeticUpdate = async() => { // 사용제한 원료 업데이트
    const storedUsername = getCookie('my-cookie');
    

    if (!confirm("사용제한 원료를 업데이트하면 기존의 데이터가 전부 변경됩니다. 선택하시겠습니까? ")) {
    } else { // 업데이트를 진행해야 한다면

      loadChange(true);

      // 확인
      let page_row = 0;
      let page_count = 0;
  
      let array = [];
      
      

      // 화장품 사용제한 원료정보 조회
      // https://www.data.go.kr/data/15111774/openapi.do#/API%20%EB%AA%A9%EB%A1%9D/getCsmtcsIngdCpntInfoService01
      const url = `${cosmetic_api}/CsmtcsIngdCpntInfoService01/getCsmtcsIngdCpntInfoService01`; 

            
      let params = 
      {
        serviceKey : cosmetic_key,
        pageNo : 1,
        numOfRows : 100,
        type : 'json'
  
      };
      const config = {
        params : params,
        headers:{
          "Content-Type": "application/json",
          
        }
      }
        await axios.get(url,config).then(res=>{
        
          page_row = res.data.body.totalCount;
          array = res.data.body.items; 
          cosmetic_material_status_data['title'] = "초기데이터 요청중...";
          cosmetic_material_status_data['total_count'] = page_row;
          cosmetic_material_status_data['ing_count'] = array.length;
          cosmetic_material_status_data['final_total_count'] =0;
          cosmetic_material_status_state.update(()=> cosmetic_material_status_data);
       })
       
       if(page_row > 0){
        page_count = Math.ceil(page_row / 100);
        console.log('array : ', array);
  
        if(page_count > 0){
          let count = 2; 
          for(let i=0; i<page_count-1; i++){
            
           
            
            let params = 
            {
              serviceKey : cosmetic_key,
              pageNo : count,
              numOfRows : 100,
              type : 'json'
        
            };
            const config = {
              params : params,
              headers:{
                "Content-Type": "application/json",
                
              }
            }
              await axios.get(url,config).then(res=>{
                console.log('res : ', res);
                page_row = res.data.body.totalCount;
                if(array.length > 0){
                  array = array.concat(res.data.body.items);
                  
                  cosmetic_material_status_data['title'] = "데이터 가공 및 누적중...";
                  cosmetic_material_status_data['ing_count'] = array.length;
                  
                  cosmetic_material_status_state.update(()=> cosmetic_material_status_data);
                }
               
        
             })
             count++;
          }
  
        }
  
      
        var filteredData = array.filter(function(obj) {
          return obj.INGR_KOR_NAME != null || obj.INGR_ENG_NAME != null;
        });


    
       
       let final_data = filteredData.map(obj => {
        let newObj = {};
          for (let key in obj) {
              if(obj[key]){
                newObj[key.toLowerCase()] = obj[key];
              }else {
                newObj[key.toLowerCase()] = "";
              }
              
          }
          return newObj;
        });

       

        cosmetic_material_status_data['title'] = "데이터 입력중...";
        cosmetic_material_status_data['ing_count'] = final_data.length;
        cosmetic_material_status_data['final_total_count'] = final_data.length;
        
        cosmetic_material_status_state.update(()=> cosmetic_material_status_data);

      


        const create_url = `${api}/cosmetic_material/save`
        try {    
          console.log('storedUsername : ', storedUsername);   
          let params = {
            id : storedUsername,
            cosmetic_material_array : final_data,
            token : login_data['token'],
          };
        axios.post(create_url,
          params,
        ).then(res => {
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            // factory_modal_state.update(() => update_modal);
            select_query('cosmetic_material');
            loadChange(false);

            cosmetic_material_status_data['title'] = "";
            cosmetic_material_status_data['ing_count'] = 0;
            cosmetic_material_status_data['total_count'] = 0;
            cosmetic_material_status_data['final_total_count'] =0;
            
            cosmetic_material_status_state.update(()=> cosmetic_material_status_data);


            return common_toast_state.update(() => toast);

          }else{
            loadChange(false);
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          loadChange(false);
          return console.log('에러 : ',e);
        };
        


      
  
       }
     
    }
  }
 

  



export {cosmeticMaterialModalOpen,save,modalClose,cosmeticUpdate}