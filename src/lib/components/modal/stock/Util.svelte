
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea,Fileupload,Img} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {stock_modal_state, stock_form_state} from '$lib/store/stock/state';
    import {common_alert_state, common_toast_state,common_company_state,common_type_state,common_factory_state,common_factory_sub_state,common_factory_sub_filter_state} from '$lib/store/common/state';
    import {fileButtonClick} from '$lib/store/common/function';
    import {save,modalClose,factoryChange} from '$lib/store/stock/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    import {handleSubmit} from '$lib/store/common/function';
    export let title;



  
    console.log('title',title);
    
    let label_title = '';
   
   
    if(title === 'add'){
      label_title = '추가';
    }else if(title === 'update'){
      label_title = '조정';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 

  

    </script>
        



    <Modal title={`재고 ${label_title}`} permanent={true} color={color} bind:open={$stock_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
         <form action="#" on:submit={handleSubmit} >
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-3 gap-4">
          <Label class="space-y-1">
            <span>이전 공장</span>
            <Select id="countrie" disabled class="mt-2" bind:value={$stock_form_state['prev_factory']} placeholder="">
                {#each $common_factory_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
          <Label class="space-y-2">
            <span>이전 창고</span>
            <Select id="countrie" disabled class="mt-2" bind:value={$stock_form_state['prev_factory_sub']} placeholder="">
                {#each $common_factory_sub_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
          <Label class="space-y-2">
            <span>변경 공장</span>
            <Select id="countrie" class="mt-2" bind:value={$stock_form_state['after_factory']} placeholder="" on:change={factoryChange($stock_form_state['after_factory'])}>
                {#each $common_factory_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
          <Label class="space-y-2">
            <span>변경 창고</span>
            <Select id="countrie"  class="mt-2" bind:value={$stock_form_state['after_factory_sub']} placeholder="">
                {#each $common_factory_sub_filter_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>



       

          <Label class="space-y-2">
            <span>LOT</span>
            <Input type="text" id="last_name" readOnly placeholder="로트를 입력하세요" required bind:value={$stock_form_state['lot']}/>
          </Label>
        
          <Label class="space-y-2">
            <span>품목코드</span>
            <Input type="text" id="last_name" readOnly placeholder="품목코드를 입력하세요" required bind:value={$stock_form_state['item']['code']}/>
          </Label>
       

          <Label class="space-y-2">
            <span>한글 품목명</span>
            <Textarea type="text" id="last_name" readOnly rows="4"  placeholder="한글 품목명을 입력하세요" required bind:value={$stock_form_state['item']['ingr_kor_name']}/>
            
           
          </Label>
          
          <Label class="space-y-2">
            <span>영문 품목명</span>
            <Textarea type="text" id="last_name" readOnly rows="4"  placeholder="영문 품목명을 입력하세요" required bind:value={$stock_form_state['item']['ingr_eng_name']}/>
            
           
          </Label>

          <Label class="space-y-2">
            <span>기존 수량 {$stock_form_state['unit'] !== "" ? "[단위 : " + $stock_form_state['unit'] + "]" : ""}</span>
            <Input type="number" id="last_name" disabled  required bind:value={$stock_form_state['prev_qty']}/>
          </Label>
          <Label class="space-y-2">
            <span>조정후 수량</span>
            <Input type="number" id="last_name" required bind:value={$stock_form_state['after_qty']}/>
          </Label>
          <Label class="space-y-2">
            <span>재고 상태</span>
            <Input type="text" id="last_name" readOnly placeholder="재고 상태를 입력하세요" required bind:value={$stock_form_state['status']}/>
          </Label>


          <Label class="space-y-2">
            <span>조정 사유</span>
            <Textarea type="text" id="last_name" rows="4" required bind:value={$stock_form_state['control_reason']}/>
           
          </Label>


       
          </div>
         

          <div class="grid grid-cols-1 gap-4">
                <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>
         
          </div>

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
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={save($stock_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
    <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
        
      </svelte:fragment> 
       

      </Modal>

    