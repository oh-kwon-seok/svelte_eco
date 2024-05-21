
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img,Datepicker} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {work_task_modal_state, work_task_form_state} from '$lib/store/work_task/state';

    import WorkPlanSearch from '$lib/components/modal/work_task/WorkPlan.svelte';

    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,workPlanSearchModalOpen } from '$lib/store/work_task/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    
    import {work_plan_modal_state} from '$lib/store/work_plan/state';
    import {company_modal_state} from '$lib/store/company/state';

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

    

    </script>
      
    <style>
    
    /* .full-screen-modal {
      position: fixed;
      top: 0; 
      left: 0;
      width: 100vw;
    } */
    </style>

 
      
    <Modal  class="w-full" title={`생산지시 ${label_title}`} permanent={true} color={color}  bind:open={$work_task_modal_state[title]['use']} size="xl"  placement={'center'}   >
       
          <!-- grid grid-cols-2 gap-4 -->
        <form  action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-3 gap-4 ">
          
          <Label class="space-y-2">
            <span>생산계획번호{$work_task_form_state['bom_code']}</span>
            <Input type="text" id="last_name" placeholder="생산계획을 입력하세요" required bind:value={$work_task_form_state['work_plan_code']} on:click={() => {workPlanSearchModalOpen('work_task_work_plan_search')}}/>
            
            {#if $work_task_form_state['work_plan_code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          {#if $work_plan_modal_state['title'] === 'work_task_work_plan_search' }
          <WorkPlanSearch title="work_task_work_plan_search" />
          {/if}
      
          
          <Label class="space-y-2">
            <span>생산지시시작일자</span>

            <Input type="date"   id="last_name" placeholder="생산 예정 시작 일자룰 입력하세요" required bind:value={$work_task_form_state['work_start_date']}/>
          </Label>
          <Label class="space-y-2">
            <span>생산지시종료일자</span>

            <Input type="date"   id="last_name" placeholder="생산 예정 종료 일자룰 입력하세요" required bind:value={$work_task_form_state['work_end_date']}/>
          </Label>
          <Label class="space-y-2">
            <span>생산제품</span>
            <Input type="text" id="last_name" readOnly placeholder="제품을 선택하세요" required bind:value={$work_task_form_state['bom_code']} />
            
          
          </Label>

          <Label class="space-y-2">
            <span>지시수량</span>
            <Input type="text" id="last_name" placeholder="지시수량을 입력하세요" required bind:value={$work_task_form_state['task_qty']} />
            
            {#if (parseFloat($work_task_form_state['task_qty']) === 0 || parseFloat($work_task_form_state['task_qty']) < 0)   && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">수량을 0이상 입력해주세요</span></Helper>
            {/if}
          </Label>

          <Label class="space-y-2">
            <span>단위</span>
            <Input type="text" id="last_name" placeholder="단위를 입력하세요" required bind:value={$work_task_form_state['unit']} />
            
            {#if parseFloat($work_task_form_state['unit']) === "" && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">단위를 입력하세요.</span></Helper>
            {/if}
          </Label>
      

         
  
          {#if $work_task_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$work_task_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>

          
  

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
    <Button  color={color}  class="w-1/2" on:click={save($work_task_form_state,title)}>{label_title}</Button>
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
    {#if $common_alert_state['type'] === 'print' && $common_alert_state['value'] === true}
      <Alert  state={'print'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['print'].title} content={DATA_FAIL_ALERT['print'].content} />
    {/if}
        
      </svelte:fragment> 
       

      </Modal>
  

    