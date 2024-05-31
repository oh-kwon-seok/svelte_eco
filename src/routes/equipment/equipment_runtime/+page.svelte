

<script lang="ts">
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/equipment_runtime/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {equipmentRuntimeModalOpen,makeCustomTable} from '$lib/store/equipment_runtime/function';
    import {excelDownload} from '$lib/store/common/function';
    
    import {equipment_runtime_form_state,equipment_runtime_modal_state} from '$lib/store/equipment_runtime/state';

    import {url_state,cookie_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/sales/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
	import { afterUpdate, onMount } from 'svelte';

  import ApexCharts from 'apexcharts';

  
	import moment from 'moment';
            
  
    export let data;
    let runtime_chart: ApexCharts | null = null;
 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"equipment_runtime",tableComponent,"select",runtime_chart);
    
    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/sales/equipment_runtime'){
         
            //makeCustomTable(table_list_state,"equipment_runtime",tableComponent,"select");
        }
      
    })
     
 

 

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
          #runtime_chart {
            min-width: 80vw;
            max-width: 80vw;
            margin: 0 auto;
        }

     

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
              <Title title='설비 관리' subtitle='설비 가동 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">설비 가동 관리</span>

                
                      <SearchBar title="equipment_runtime"/>


                      <div class='m-5'>

                        <Button  on:click={() => {equipmentRuntimeModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => equipmentRuntimeModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                   
                      
                 
        
                        {#if $equipment_runtime_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $equipment_runtime_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $equipment_runtime_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>

                      <div class="flex flex-row">
                        <div id="runtime_chart" bind:this={runtime_chart}></div>
                    
                    </div>

                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    