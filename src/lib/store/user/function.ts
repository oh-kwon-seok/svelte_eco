

//@ts-nocheck

import { writable } from 'svelte/store';
import {user_modal_state,user_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_list_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_list_data : any;
let user_data : any;

let selected_data : any;


const init_form_data:any = {
  uid : 0,
  id : '',
  company : '', // 사업장
  employment : '',
  department : '',

  name : '', // 사용자이름
  email : '', // 이메일
  phone : '', // 연락처
  password : '1111',
  auth:'',
  used : 1,


}


user_modal_state.subscribe((data) => {
    update_modal = data;
})

user_form_state.subscribe((data) => {
    update_form = data;
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
common_user_state.subscribe((data) => {
  user_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})
 
 



const userModalOpen = (data : any, title : any) => {
 console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    user_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      user_form_state.update(() => init_form_data);
     
    }
    if(title === 'update' ){



        Object.keys(update_form).map((item)=> {    
            if(item === 'company' || item === 'employment' || item === 'department'){
              update_form[item] = data[item]['uid'];
            }else if(item === 'auth'){
              update_form[item] = data[item][0];
            
            
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            user_form_state.update(() => update_form);
            user_modal_state.update(() => update_modal);
            console.log('update_form : ', update_form);

    }
    if(title === 'check_delete'){
      let data =  table_list_data['user'].getSelectedData();

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
      console.log('table_list_state : ', table_list_state['user']);
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
  common_alert_state.update(() => alert);
  user_modal_state.update(() => update_modal);


}



const save = (param,title) => {

  console.log('param : ', param);
  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
  
    
      if( param['id'] === '' || param['password'] === '' || param['company'] === '' || param['employment'] === '' || param['department'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        user_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/user/save`
        try {
  
          
          let params = {
            id : param.id,
            company_uid : param.company,
            employment_uid : param.employment,
            department_uid : param.department,
            name : param.name,
            email : param.email,
            phone : param.phone,
            password : param.password,
            used : param.used,
            auth : 'user',
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
            user_modal_state.update(() => update_modal);

            

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
      const url = `${api}/user/update`
      
      let auth ;

      if(param.auth === 'ROLE_ADMIN'){
        auth= 'admin';

      }else{
        auth = 'user';
      }
      
    
     
     
      try {

      
        let params = {
          id : param.id,
          company_uid : param.company,
          employment_uid : param.employment,
          department_uid : param.department,
          name : param.name,
          password : param.password,
          email : param.email,
          phone : param.phone,
          
         
          used : param.used,
          auth : auth,
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
          user_modal_state.update(() => update_modal);
          user_form_state.update(()=> init_form_data);
          select_query('user');
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

          const url = `${api}/user/delete`
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
              user_modal_state.update(() => update_modal);
              user_form_state.update(()=> init_form_data);

              select_query('user');
    
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


  





export {userModalOpen,save,modalClose}