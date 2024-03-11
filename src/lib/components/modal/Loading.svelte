
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Spinner} from 'flowbite-svelte'
    

    import { InfoCircleSolid } from 'flowbite-svelte-icons';
 
    
    export let title; 
    export let content; 

    let open = true;
  

    </script>

 

    <Modal title={title} permanent={true} color={'blue'} bind:open={open} size="xs" placement={'center'}   >
        <div class="text-center">
            <InfoCircleSolid class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{content}</h3>
            <Spinner size={8} />
          </div>
  
    
      </Modal>

    