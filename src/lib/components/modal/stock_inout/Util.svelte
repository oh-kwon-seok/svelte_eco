
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img,Datepicker} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {stock_inout_modal_state, stock_inout_form_state} from '$lib/store/stock_inout/state';
    import CompanySearch from '$lib/components/modal/stock_inout/Company.svelte';
    import ItemSearch from '$lib/components/modal/stock_inout/Item.svelte';

    import EstimateSearch from '$lib/components/modal/stock_inout/Estimate.svelte';
    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,stockInoutSubModalTable,stockInoutAddRow, stockInoutDeleteRow, stockInoutAllDeleteRow} from '$lib/store/stock_inout/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {onMount,afterUpdate } from 'svelte';
    import {item_modal_state} from '$lib/store/item/state';
    import {company_modal_state} from '$lib/store/company/state';
  
    import {estimate_modal_state} from '$lib/store/estimate/state';
    export let title;

    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

  

    
    let label_title = '';


   
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }

    let color ; 


    if(title === 'add' ||  title === 'update'){
      color = "blue";

    }else if(title === 'check_delete'){
      color = "red";

    }else{
      color = "light";

    }

    let showModal = false;

    let tableComponent = "example-table-theme";

    afterUpdate(() => {
        if(title === 'add'){

        
          if($stock_inout_form_state['modal'] === false){
            stockInoutSubModalTable(table_modal_state,"stock_inout_sub",tableComponent,"info_select","add");
          }
      }
      if(title === 'update'){
      
        
      if($stock_inout_form_state['modal'] === false){
     
          stockInoutSubModalTable(table_modal_state,"stock_inout_sub",tableComponent,"info_select","update");
        }

     }
    });
    onMount(()=>{
      
 
       if(title === 'add'){
      
        
        if($stock_inout_form_state['modal'] === false){
         
            stockInoutSubModalTable(table_modal_state,"stock_inout_sub",tableComponent,"info_select","add");
          }

       } if(title === 'update'){
      
        
      if($stock_inout_form_state['modal'] === false){
        
          stockInoutSubModalTable(table_modal_state,"stock_inout_sub",tableComponent,"info_select","update");
        }

     }
     
  
   });



    

    </script>
      
    <style>
    
    /* .full-screen-modal {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100vw;
    } */
    </style>

 
      
    <Modal  class="w-full" title={`입출고 ${label_title}`} permanent={true} color={color}  bind:open={$stock_inout_modal_state[title]['use']} size="xl"  placement={'center'}   >
       
          <!-- grid grid-cols-2 gap-4 -->
        <form  action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4 ">
          <Label class="space-y-2">
            <span>입출고유형</span>
            <Select id="countries" class="mt-2" bind:value={$stock_inout_form_state['status']} placeholder="">
                  <option value={"입고"}>{"입고"}</option>
                  <option value={"출고"}>{"출고"}</option>

              </Select>
              
          </Label>
          <Label class="space-y-2">
            <span>용도</span>
            <Select id="countries" class="mt-2" bind:value={$stock_inout_form_state['doc_type']} placeholder="">
                <option value={"입고"}>{"입고"}</option>
                <option value={"샘플"}>{"샘플"}</option>
                <option value={"생산"}>{"생산"}</option>
                <option value={"품질"}>{"품질"}</option>
                <option value={"출하"}>{"출하"}</option>
              </Select>
          </Label>
          </div>
      
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

          <div class="grid grid-cols-3 gap-4">
          
           
              
     
      </div>

              <div class="grid grid-cols-1 gap-4">
                <p class="mb-4 font-semibold text-xl dark:text-white">입출고 리스트</p>
              
              </div>
                
          

              <div class="flex justify-start">
                <Button class="m-2 " outline color="blue" on:click={(e) => stockInoutAddRow(e)}>행 추가</Button>
               
                <Button class="m-2" outline color="red" on:click={stockInoutDeleteRow}>행 삭제</Button>
                <Button class="m-2" outline color="purple" on:click={stockInoutAllDeleteRow}>전체 삭제</Button>
              
              </div>
              
         
          
            <div class="flex flex-row">
              <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
            </div>
          
          <!-- {#if $item_modal_state['title'] === 'stock_inout_item_search'}
              <ItemSearch title="stock_inout_item_search" />
          {/if} -->
       

   


          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
            {#if title === 'check_delete'}
            <div>선택한 항목을 삭제하시겠습니까?</div>
            {:else if title === 'print' }
            <div>선택한 항목을 출력하시겠습니까?</div>
            
            {/if}
          {/if}
    
    
      
      
        </form>
   <svelte:fragment slot='footer'> 
    <Button  color={color}  class="w-1/2" on:click={save($stock_inout_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'code' && $common_alert_state['value'] === true}
        
    <Alert  state={'code'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['code'].title} content={DATA_FAIL_ALERT['code'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
      <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
  
        
      </svelte:fragment> 
       

      </Modal>
  

    