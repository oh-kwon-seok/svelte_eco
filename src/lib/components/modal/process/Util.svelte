
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
  
    import {process_modal_state, process_form_state} from '$lib/store/process/state';

    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,processModalTable,processAddRow, processDeleteRow, processAllDeleteRow } from '$lib/store/process/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {onMount,afterUpdate } from 'svelte';
    export let title;

    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

  
    console.log('title',title);
    
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

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 

    let showModal = false;

    let tableComponent = "example-table-theme";

    onMount(()=>{
      
      console.log('table_modal_state : ', table_modal_state['process_qc']);
    
       if(title === 'add'){
         if($process_form_state['modal'] === false){
           // 여기에 테이블 그려야됌
         processModalTable(table_modal_state,"process_qc",tableComponent,"info_select","add");
         
       
       }

       }else if(title === 'update'){
         // 수정일때, 이따 작업
         if($process_form_state['modal']  === false){
                processModalTable(table_modal_state,"process_qc",tableComponent,"info_select","update");
             
            }
       }
      
  
   });

   afterUpdate(()=> {
      
  
          if(title === 'add'){
              if($process_form_state['modal'] === false){
                  processModalTable(table_modal_state,"process_qc",tableComponent,"info_select","add");              
              }

          }else if(title === 'update'){
          // 수정일때, 이따 작업
          if($process_form_state['modal'] === false){
              processModalTable(table_modal_state,"process_qc",tableComponent,"info_select","update");
             }
        }
      
      });

    </script>
      

 

    <Modal title={`공정 ${label_title}`} permanent={true} color={color} bind:open={$process_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
    
          <Label class="space-y-2">
            <span>공정명</span>
            <Input type="text" id="last_name" placeholder="공정을 입력하세요" required bind:value={$process_form_state['name']} />
            
            {#if $process_form_state['name'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

        
        
          <Label class="space-y-2">
            <span>용도</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$process_form_state['status']}/>
          </Label>
          <Label class="space-y-2">
            <span>비고</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$process_form_state['description']}/>
           
          </Label>

         
          {#if $process_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$process_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
      

          
          
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

        
              
         
              {#if $process_form_state['name'] !== ""}
              <div class="grid grid-cols-1 gap-4">
                <p class="mb-4 font-semibold text-xl dark:text-white">공정검사 리스트</p>
              
              </div>
              
          

              <div class="flex justify-start">
                <Button class="m-2 " outline color="blue" on:click={(e) =>processAddRow(e)}>행 추가</Button>
               
                <Button class="m-2" outline color="red" on:click={processDeleteRow}>행 삭제</Button>
                <Button class="m-2" outline color="purple" on:click={processAllDeleteRow}>전체 삭제</Button>
              
              </div>
              
         
          
            <div class="flex flex-row">
              <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
            </div>
           
           

              {:else}
                <div class="grid grid-cols-1 gap-4">
                  <p class="mb-4 font-semibold text-xl dark:text-white">공정명을 선택해주십시오.</p>
                
                </div>
          {/if}
             
            
               
   


          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
              {#if title === 'delete'}
              <div>삭제하시겠습니까?</div>
              {:else }
              <div>선택한 항목을 삭제하시겠습니까?</div>
              
              {/if}
          {/if}
    
    
      
      
        </form>
   <svelte:fragment slot='footer'> 
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={save($process_form_state,title)}>{label_title}</Button>
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

    