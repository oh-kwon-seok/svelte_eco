
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import ItemSearch from '$lib/components/modal/bom/Item.svelte';
    import {bom_modal_state, bom_form_state} from '$lib/store/bom/state';
    import {item_modal_state} from '$lib/store/item/state';
    
    import {common_alert_state, common_toast_state,common_company_state,common_type_state, table_modal_state} from '$lib/store/common/state';
    import {fileButtonClick,handleSubmit} from '$lib/store/common/function';
    import {save,modalClose,itemSearchModalOpen,bomModalTable,bomAddRow, bomDeleteRow, bomAllDeleteRow } from '$lib/store/bom/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {onMount,afterUpdate } from 'svelte';
    export let title;



  
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
     
        if(table_modal_state['bom']){

        }else{
          if(title === 'add'){
            if($bom_form_state['code'] !== ""){
              // 여기에 테이블 그려야됌
            bomModalTable(table_modal_state,"bom",tableComponent,"info_select","add");
            
          
          }

          }else if(title === 'update'){
            // 수정일때, 이따 작업
            if($bom_form_state['code'] !== ""){
                 
                 if($table_modal_state['bom']){
                  console.log('마운트 ? : ', $table_modal_state['bom']);
                 }else{
                  console.log('마운트 ?333 ');
                   bomModalTable(table_modal_state,"bom",tableComponent,"info_select","update");
                 }
               }
          }
         
        }
       

      });

      afterUpdate(()=> {
      
        if(table_modal_state['bom']){
         
          }else{
            if(title === 'add'){
            
                if($bom_form_state['code'] !== ""){
                 
                  if($table_modal_state['bom']){

                  }else{
                    bomModalTable(table_modal_state,"bom",tableComponent,"info_select","add");
                  }
                
                
              
                }

              
                

            }else if(title === 'update'){
              // 수정일때, 이따 작업
              if($bom_form_state['code'] !== ""){
                 
                 if($table_modal_state['bom']){

                 }else{
                   bomModalTable(table_modal_state,"bom",tableComponent,"info_select","update");
                 }
               
               
             
               }
            }
          
          }
      })


    

    </script>
        <style>
          .modal {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;

        }
    
          .modal img {
            max-width: 80%;
            max-height: 80%;
          }
          .tabulator .tabulator-tree .tabulator-data-tree .tabulator-data-tree-branch i {
              margin-left: 5px; /* 오른쪽으로 이동할 거리를 조정하세요 */
              margin-right: 0; /* 기존의 오른쪽 여백을 없앱니다 */
          }

              
        </style>

 

    <Modal title={`생산레시피 ${label_title}`} permanent={true} color={color} bind:open={$bom_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
    
          <Label class="space-y-2">
            <span>품목코드</span>
            <Input type="text" id="last_name" placeholder="품목코드를 입력하세요" required bind:value={$bom_form_state['code']} on:click={() => {itemSearchModalOpen('search')}}/>
            
            {#if $bom_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>

          {#if $item_modal_state['title'] === 'search' }
          <ItemSearch title="search" />
          {/if}

          {#if $item_modal_state['title'] === 'bom_search'}
          <ItemSearch title="bom_search" />
          {/if}

          <Label class="space-y-2">
            <span>수량</span>
            <Input type="text" id="last_name" placeholder="수량을 입력하세요" required bind:value={$bom_form_state['qty']} />
            
            {#if (parseFloat($bom_form_state['qty']) === 0 || parseFloat($bom_form_state['qty']) < 0)   && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">수량을 0이상 입력해주세요</span></Helper>
            {/if}
          </Label>
          <Label class="space-y-2">
            <span>비율</span>
            <Input type="text" id="last_name" placeholder="비율을 입력하세요(1KG 기준일 경우, 1로 입력하면 됩니다.)" required bind:value={$bom_form_state['rate']} />
            
            {#if (parseFloat($bom_form_state['rate']) === 0 || parseFloat($bom_form_state['rate']) < 0)   && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">비율을 0이상 입력해주세요</span></Helper>
            {/if}
          </Label>
          
          <Label class="space-y-2">
            <span>비고</span>
            <Textarea type="text" id="last_name" rows="4"  bind:value={$bom_form_state['description']}/>
           
          </Label>

         
          {#if $bom_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$bom_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
          </div>
      

          
          
          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

            {#if $bom_form_state['code'] !== ""}
              <div class="grid grid-cols-1 gap-4">
                <p class="mb-4 font-semibold text-xl dark:text-white">BOM 리스트</p>
              
              </div>
              
          

              <div class="flex justify-start">
                <Button class="m-2 " outline color="blue" on:click={bomAddRow}>행 추가</Button>
                <Button class="m-2" outline color="red" on:click={bomDeleteRow}>행 삭제</Button>
                <Button class="m-2" outline color="purple" on:click={bomAllDeleteRow}>전체 삭제</Button>
              
              </div>
              
         
            
             
            
              

              <div class="flex flex-row">
                <div  class="w-full" id="example-table-theme" bind:this={tableComponent}></div>
              </div>
              {:else}
                <div class="grid grid-cols-1 gap-4">
                  <p class="mb-4 font-semibold text-xl dark:text-white">품목코드를 선택해주십시오.</p>
                
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
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={save($bom_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
    <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
        
      </svelte:fragment> 
       

      </Modal>

    