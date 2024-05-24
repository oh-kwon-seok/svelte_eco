

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/work_task/Util.svelte';
    import UtilStockRequest from '$lib/components/modal/work_task/UtilStockRequest.svelte';
    
    import UtilMeasure from '$lib/components/modal/work_task/UtilMeasure.svelte';

    import UtilProduct from '$lib/components/modal/work_task/UtilProduct.svelte';
    import UtilPacking from '$lib/components/modal/work_task/UtilPacking.svelte';


    import * as Icon from 'svelte-awesome-icons';

    import {workTaskModalOpen,makeCustomTable} from '$lib/store/work_task/function';
    import {excelDownload} from '$lib/store/common/function';
    
    import {work_task_form_state,work_task_modal_state} from '$lib/store/work_task/state';

    import {url_state,cookie_state,production_work_task_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/sales/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
	import { afterUpdate, onMount } from 'svelte';



  
	import moment from 'moment';
            
  
    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"work_task",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/production/work_task'){
         
            makeCustomTable(table_list_state,"work_task",tableComponent,"select");
        }
      
    })
     
 

 

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';


     

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
              <Title title='생산 관리' subtitle='생산 계획'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">생산 계획</span>

                
                      <SearchBar title="work_task"/>


                      <div class='m-5'>

                        <Button  on:click={() => {workTaskModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => workTaskModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                              

                 
                        {#if $work_task_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $work_task_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $work_task_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                          {:else if $work_task_modal_state['title'] === 'stock_request'}
                          <UtilStockRequest  title="stock_request"/>
                          {:else if $work_task_modal_state['title'] === 'measure'}
                          <UtilMeasure  title="measure"/>
                          {:else if $work_task_modal_state['title'] === 'production'}
                          <UtilProduct  title="production"/>
                          {:else if $work_task_modal_state['title'] === 'packing'}
                          <UtilPacking  title="packing"/>
                       
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    