
<script>

    // @ts-nocheck
    import {Button ,Modal, } from 'flowbite-svelte'
    

    import {company_modal_state} from '$lib/store/company/state';
    import {table_modal_state} from '$lib/store/common/state';
    
    import {companySearchTable,companySearchModalClose} from '$lib/store/order/function';


    import {handleSubmit} from '$lib/store/common/function';
    


    import {onMount,afterUpdate } from 'svelte';
    export let title;



  
    console.log('title',title);
    
    let label_title = '';
   

    let color =  'green'; 

    let tableComponent = "example-table-theme";
 


      onMount(()=>{
        companySearchTable(table_modal_state,"company",tableComponent,"customer_select",title);
      });

      afterUpdate(()=> {
        companySearchTable(table_modal_state,"company",tableComponent,"customer_select",title);
      })

    </script>

 

    <!-- svelte-ignore missing-declaration -->
    <Modal title={`거래처 선택`}  permanent={true} color={color} bind:open={$company_modal_state[title]['use']} size="xl" placement={ 'center'}   class="w-full">
       
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
        
       
        <Button  class="w-full" color='red' on:click={companySearchModalClose(title)}>닫기</Button>
      
      
        </svelte:fragment>
      

      </Modal>

    