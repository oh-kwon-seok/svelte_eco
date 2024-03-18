
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper, Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {item_modal_state, item_form_state} from '$lib/store/item/state';
    import {common_alert_state, common_toast_state,common_company_state,common_type_state} from '$lib/store/common/state';
    
    import {save,modalClose} from '$lib/store/item/function';
    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT,TABLE_HEADER_LIST_FILTER} from '$lib/module/common/constants';
    
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


  

    </script>

 

    <Modal title={`품목 ${label_title}`} permanent={true} color={color} bind:open={$item_modal_state[title]['use']} size="xl" placement={'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
   
        <div class="grid grid-cols-2 gap-4">
          <Label class="space-y-2">
            <span>취급사</span>
            <Select id="countrie" class="mt-2" bind:value={$item_form_state['company']} placeholder="">
                {#each $common_company_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>
          <Label class="space-y-2">
            <span>품목구분</span>
            <Select id="countrie" class="mt-2" bind:value={$item_form_state['type']} placeholder="">
                {#each $common_type_state as item}
                  <option value={item.uid}>{item.name}</option>
                {/each}
              </Select>
          </Label>


        
          <Label class="space-y-2">
            <span>품목코드</span>
            <Input type="text" id="last_name" placeholder="품목코드를 입력하세요" required bind:value={$item_form_state['code']}/>
            
            {#if $item_form_state['code'] === '' && $common_alert_state['value'] === true}
            <Helper class="mt-2" color="red"><span class="font-medium">데이터를 입력해주세요</span></Helper>
            {/if}
          </Label>
          <Label class="space-y-2">
            <span>약호</span>
            <Textarea type="text" id="last_name" rows="4"  placeholder="약호를 입력하세요" required bind:value={$item_form_state['simple_code']}/>
            
           
          </Label>

          <Label class="space-y-2">
            <span>한글 품목명</span>
            <Textarea type="text" id="last_name" rows="4"  placeholder="한글 품목명을 입력하세요" required bind:value={$item_form_state['ingr_kor_name']}/>
            
           
          </Label>
          <Label class="space-y-2">
            <span>영문 품목명</span>
            <Textarea type="text" id="last_name" rows="4"  placeholder="영문 품목명을 입력하세요" required bind:value={$item_form_state['ingr_eng_name']}/>
            
           
          </Label>
          <Label class="space-y-2">
            <span>수불단위</span>
            <Input type="text" id="last_name" placeholder="수불단위를 입력하세요" required bind:value={$item_form_state['inout_unit']}/>
           
           
          </Label>
          <Label class="space-y-2">
            <span>수불구분</span>
            <Input type="text" id="last_name" placeholder="수불구분을 입력하세요" required bind:value={$item_form_state['inout_type']}/>
          </Label>
          <Label class="space-y-2">
            <span>화폐단위</span>
            <Select id="countrie" class="mt-2" bind:value={$item_form_state['currency_unit']} placeholder="">
             
                  <option value={"KRW"}>{"KRW"}</option>
                  <option value={"￥"}>{"￥"}</option>
                  
              
              </Select>
          </Label>
          <Label class="space-y-2">
            <span>구매구분</span>
            <Input type="text" id="last_name" placeholder="구매구분을 입력하세요" required bind:value={$item_form_state['buy_type']}/>
          </Label>
          <Label class="space-y-2">
            <span>품목분류</span>
            <Select id="countrie" class="mt-2" bind:value={$item_form_state['type_code']} placeholder="">
             
                  <option selected value={"원자재"}>{"원자재"}</option>
                  <option value={"부자재"}>{"부자재"}</option>
                  <option value={"반제품"}>{"반제품"}</option>
                  <option value={"완제품"}>{"완제품"}</option>
                  
                  
            
              </Select>
          </Label>

          <Label class="space-y-2">
            <span>유형코드</span>
            <Input type="text" id="last_name" placeholder="유형코드를 입력하세요" required bind:value={$item_form_state['classify_code']}/>
          </Label>
          <Label class="space-y-2">
            <span>성분코드</span>
            <Input type="text" id="last_name" placeholder="성분코드를 입력하세요" required bind:value={$item_form_state['component_code']}/>
          </Label>
          <Label class="space-y-2">
            <span>HS코드</span>
            <Input type="text" id="last_name" placeholder="HS코드를 입력하세요" required bind:value={$item_form_state['hs_code']}/>
          </Label>
          <Label class="space-y-2">
            <span>국세청 코드</span>
            <Input type="text" id="last_name" placeholder="국세청 코드를 입력하세요" required bind:value={$item_form_state['nts_code']}/>
          </Label>
          <Label class="space-y-2">
            <span>비고</span>
            <Textarea type="text" id="last_name" rows="4" required bind:value={$item_form_state['description']}/>
           
          </Label>
    
    

    
        
          {#if $item_modal_state['title'] === 'update'}
            <Label class="space-y-2">
              <span>사용유무</span>
              <Select id="countries" class="mt-2" bind:value={$item_form_state['used']} placeholder="">
                    <option value={0}>{"사용안함"}</option>
                    <option value={1}>{"사용"}</option>

                </Select>
            </Label>
          {/if}
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
    <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}  class="w-1/2" on:click={save($item_form_state,title)}>{label_title}</Button>
    <Button  color='red'  class="w-1/2" on:click={modalClose(title)}>닫기</Button>
         
    {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
        
    <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

    {/if}
    {#if $common_alert_state['type'] === 'check_delete' && $common_alert_state['value'] === true}
          
    <Alert  state={'check_delete'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['check_delete'].title} content={DATA_FAIL_ALERT['check_delete'].content} />

    {/if}
        
      </svelte:fragment> 
       

      </Modal>

    