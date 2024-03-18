

<script>

	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem,Button} from 'flowbite-svelte';



    import Util from '$lib/components/modal/factory/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

   
    
    import {factory_form_state,factory_modal_state} from '$lib/store/factory/state';

    import {url_state,table_list_state,common_toast_state,load_state} from '$lib/store/common/state';
   

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeCustomTable,infoCallApi} from '$lib/store/common/function';
    import {factoryModalOpen} from '$lib/store/factory/function';
    
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';


    export let data;



 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점',$load_state);
       
        makeCustomTable(table_list_state,"factory",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/info/factory'){
         
          makeCustomTable(table_list_state,"factory",tableComponent,"select");
        }
      
    })
     
 

 

    </script>

<style>
  @import 'tabulator-tables/dist/css/tabulator_modern.min.css';

  /* 나머지 스타일 정의 */
</style>

    
        
        {#if $common_toast_state['value'] === true}
         <Toast />
        {/if}

        
     
        <Header />

        <div class="grid grid-rows-16 grid-flow-col gap-1">
            <div class="row-span-16"> 
              <SideBar />
            </div>
            <div class="col-span-1 row-span-1"> 
              <Title title='기준정보 관리' subtitle='공장 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">공장 관리</span>

                
                      <SearchBar title="factory"/>


                      <div class='m-5'>

                        <Button  on:click={() => {factoryModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => factoryModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                       
                     

                      

                        {#if $factory_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $factory_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $factory_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        
                        {/if}
                        

                      </div>

                      
                        <div id="example-table-theme" bind:this={tableComponent}></div>
                    
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    