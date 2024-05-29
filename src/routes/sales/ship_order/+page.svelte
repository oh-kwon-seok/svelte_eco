

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/ship_order/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {shipOrderModalOpen,makeCustomTable} from '$lib/store/ship_order/function';
    import {excelDownload} from '$lib/store/common/function';
    
    import {ship_order_form_state,ship_order_modal_state} from '$lib/store/ship_order/state';

    import {url_state,cookie_state,sales_ship_order_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/sales/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
	import { afterUpdate, onMount } from 'svelte';



  
	import moment from 'moment';
            
  
    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"ship_order",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/sales/ship_order'){
         
            makeCustomTable(table_list_state,"ship_order",tableComponent,"select");
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
              <Title title='영업 관리' subtitle='출하 지시'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">출하 지시</span>

                
                      <SearchBar title="ship_order"/>


                      <div class='m-5'>

                        <Button  on:click={() => {shipOrderModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => shipOrderModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('ship_order',EXCEL_CONFIG['ship_order'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀다운
                      </Button>

                      
                      <Button  color='light' on:click={() => shipOrderModalOpen('','print')}>
                        <Icon.PrintSolid class='mr-2' size="20" />
                        출하지시서 출력
                    </Button>
                      
                 
                  

                 
                        {#if $ship_order_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $ship_order_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $ship_order_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                          {:else if $ship_order_modal_state['title'] === 'print'}
                          <Util  title="print"/>
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    