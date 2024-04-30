
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Tabs, TabItem} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {item_modal_state, } from '$lib/store/item/state';
    import {common_alert_state, common_toast_state,table_list_state,table_modal_state,common_type_state} from '$lib/store/common/state';
    
    import {itemSearchTable,modalClose,itemSearchModalClose} from '$lib/store/estimate/function';

    
    import {handleSubmit} from '$lib/store/common/function';
    


    import {onMount,afterUpdate } from 'svelte';
    export let title;



  
    console.log('title',title);
    
    let label_title = '';
   

    let color =  'green'; 

    let tableComponent = "example-table-theme";
 


      onMount(()=>{
        itemSearchTable(table_modal_state,"item",tableComponent,"info_select",title);
      });

      afterUpdate(()=> {
        itemSearchTable(table_modal_state,"item",tableComponent,"info_select",title);
      })

    </script>

 

    <Modal title={`품목 선택`}  permanent={true} color={color} bind:open={$item_modal_state[title]['use']} size="xl" placement={ 'center'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
         <form action="#" on:submit={handleSubmit} >
         
    
        
          <!-- <div class="grid grid-cols-1 gap-4">
            <p class="mb-4 font-semibold text-xl dark:text-white">품목</p>
          </div> -->
          
          <div class="grid grid-cols-1 gap-4">
            <div  id="example-table-theme" bind:this={tableComponent}></div>

          </div>
   
        </form>
        <svelte:fragment slot='footer'>
        
       
        <Button  class="w-full" color='red' on:click={itemSearchModalClose(title)}>닫기</Button>
       
      
        </svelte:fragment>
      

      </Modal>

    