
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img,Datepicker} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {work_task_modal_state, work_task_form_state} from '$lib/store/work_task/state';
    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state,common_factory_state, common_factory_sub_filter_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,workTaskProductModalTable,productSave,workTaskProductAddRow,workTaskProductDeleteRow,workTaskProductAllDeleteRow } from '$lib/store/work_task/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {commaNumber} from '$lib/module/common/function';
    import {onMount,afterUpdate } from 'svelte';
  
    export let title;


    let color ; 


    color = "blue";


    let showModal = false;

    let tableComponent = "example-table-theme";
    

  
    afterUpdate(() => {

      if($work_task_form_state['modal'] === false){
     
       
        workTaskProductModalTable(table_modal_state,"work_task_product",tableComponent);
        }
    });
    onMount(()=>{
    
      if($work_task_form_state['modal'] === false){
        
        workTaskProductModalTable(table_modal_state,"work_task_product",tableComponent);
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

 
      
    <Modal  class="w-full" title={`제조 등록`} permanent={true} color={color}  bind:open={$work_task_modal_state[title]['use']} size="xl"  placement={'center'}   >
       
          <!-- grid grid-cols-2 gap-4 -->
        <form  action="#" on:submit={handleSubmit} >
       
   
        <div class="grid grid-cols-3 gap-4 ">
          
          <Label class="space-y-2">
            <span>생산계획번호</span>
            <Input type="text" readOnly id="last_name"  required bind:value={$work_task_form_state['work_plan_code']} />   
          </Label>

        
          <Label class="space-y-2">
            <span>생산지시시작일자</span>

            <Input type="date"   readOnly id="last_name" placeholder="생산 예정 시작 일자룰 입력하세요" required bind:value={$work_task_form_state['work_start_date']}/>
          </Label>
          <Label class="space-y-2">
            <span>생산지시종료일자</span>

            <Input type="date"   readOnly id="last_name" placeholder="생산 예정 종료 일자룰 입력하세요" required bind:value={$work_task_form_state['work_end_date']}/>
          </Label>
          <Label class="space-y-2">
            <span>생산제품</span>
            <Input type="text" id="last_name" readOnly placeholder="제품을 선택하세요" required bind:value={$work_task_form_state['bom_code']} />
            
          
          </Label>

          <Label class="space-y-2">
            <span>지시수량</span>
            <Input type="text" readOnly id="last_name" placeholder="지시수량을 입력하세요" required bind:value={$work_task_form_state['task_qty']} />

         
          </Label>

          <Label class="space-y-2">
            <span>단위</span>
            <Input type="text" readOnly id="last_name" placeholder="단위를 입력하세요" required bind:value={$work_task_form_state['unit']} />
            
    
          </Label>         
          </div>




      
          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          
    
          <div class="grid grid-cols-1 gap-4 mt-5">
            <p class="mb-4 font-semibold text-xl dark:text-white">제조 리스트</p>
          
          </div>
          <div class="flex justify-start">
            <Button class="m-2 " outline color="blue" on:click={(e) => workTaskProductAddRow(e)}>행 추가</Button>
           
            <Button class="m-2" outline color="red" on:click={workTaskProductDeleteRow}>행 삭제</Button>
            <Button class="m-2" outline color="purple" on:click={workTaskProductAllDeleteRow}>전체 삭제</Button>
          
          </div>

          <div class="flex flex-row">
            <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
          </div>
         
    
    
      
      
        </form>
   <svelte:fragment slot='footer'> 
    <Button  color={color}  class="w-1/2" on:click={productSave($work_task_form_state,title)}>제조완료</Button>

    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}

        
      </svelte:fragment> 
       

      </Modal>
  

    